import axios from "axios";
import https from "https";
import { lookup } from "mime-types";

import { createServer } from "opendata-connectors-common";

import { Entity, OVM, RuianStat, Theme, Frequency, Distribuce, DatovaSada, DistribuceSoubor, DistribuceSluzba, DatovaSluzba } from "otevrene-formalni-normy-dts";
import { ENDPOINT, BASE_URL, PORT, CACHE_TIMEOUT } from "./constants";
import { catalog } from "./entities";
import { KatalogPackageList, KatalogPackageShow, KatalogResourceShow } from "./schema/katalog";



const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

function fixUrl(url: string): string;
function fixUrl(url: undefined): undefined;
function fixUrl(url: string | undefined): string | undefined {
  return url ? encodeURI(decodeURIComponent(url)) : undefined;
}


async function fetchEntities(): Promise<Entity[]> {

  const datasets: DatovaSada[] = [];
  const distributions: Distribuce[] = [];
  const services: (DatovaSluzba & { iri: string })[] = [];

  const datasetIds = await axios.get<KatalogPackageList>(`${ENDPOINT}/package_list`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

  for (let id of datasetIds) {

    process.stdout.write(".");

    const sd = await axios.get<KatalogPackageShow>(`${ENDPOINT}/package_show?id=${id}`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

    const resources = sd.distribution?.map(item => item.id) || [];
    const datasetDistributions: Distribuce[] = [];

    for (let url of resources) {

      const sr = await axios.get<KatalogResourceShow>(`${ENDPOINT}/resource_show?id=${url}`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

      const iri = BASE_URL + "/" + sd.name + "/" + sr.id;

      let typ_média: string = "";

      const mime = sr.mimetype || lookup(sr.format?.toLowerCase());
      if (mime) typ_média = "http://www.iana.org/assignments/media-types/" + mime;

      if (sr.service_endpointURL || sr.service_endpointDescription) {

        const service: DatovaSluzba & { iri: string } = {
          iri: iri + "/sluzba",
          typ: "Datová služba",
          název: { "cs": sr.name },
          přístupový_bod: fixUrl(sr.service_endpointURL) || fixUrl(sr.service_endpointDescription),
          popis_přístupového_bodu: fixUrl(sr.service_endpointDescription)
        };

        const distribution: DistribuceSluzba = {
          iri,
          typ: "Distribuce",
          název: { "cs": sr.name },
          podmínky_užití: {
            typ: "Specifikace podmínek užití",
            autorské_dílo: sr.license_autorske_dilo,
            databáze_chráněná_zvláštními_právy: sr.license_zvlastni_prava_databaze,
            databáze_jako_autorské_dílo: sr.license_originalni_databaze,
            osobní_údaje: sr.license_osobni_udaje
          },
          přístupové_url: fixUrl(sr.accessURL) || fixUrl(sr.service_endpointURL) || fixUrl(sr.service_endpointDescription),
          přístupová_služba: service
        };

        services.push(service);
        datasetDistributions.push(distribution);
      }
      else {

        const distribution: DistribuceSoubor = {
          iri,
          typ: "Distribuce",
          název: { "cs": sr.name },
          formát: "http://publications.europa.eu/resource/authority/file-type/" + sr.format?.toUpperCase(),
          typ_média,
          podmínky_užití: {
            typ: "Specifikace podmínek užití",
            autorské_dílo: sr.license_autorske_dilo,
            databáze_chráněná_zvláštními_právy: sr.license_zvlastni_prava_databaze,
            databáze_jako_autorské_dílo: sr.license_originalni_databaze,
            osobní_údaje: sr.license_osobni_udaje
          },
          soubor_ke_stažení: fixUrl(sr.downloadURL),
          přístupové_url: fixUrl(sr.accessURL)
        };

        datasetDistributions.push(distribution);
      }

    }

    const dataset: DatovaSada = {
      "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
      iri: BASE_URL + "/" + sd.name,
      typ: "Datová sada",
      název: { "cs": sd.title, },
      popis: { "cs": sd.description ? sd.description.replace(/(<([^>]+)>)/g, "") : "" },
      poskytovatel: OVM.MF,
      téma: [sd.theme || Theme.Government],
      periodicita_aktualizace: sd.accrualPeriodicity,
      klíčové_slovo: { "cs": sd.tags?.split(",").map(item => item.trim()) || [] },
      prvek_rúian: [sd.spatial],
      distribuce: datasetDistributions,
    };

    if (sd.isPartOf) dataset.je_součástí = BASE_URL + "/" + sd.isPartOf;

    distributions.push(...datasetDistributions);
    datasets.push(dataset);

  }

  process.stdout.write("\r\n");

  catalog.datová_sada = datasets.map(ds => ds.iri);

  return [
    catalog,
    ...datasets,
    ...distributions,
    ...services
  ];
}

createServer(fetchEntities, { port: PORT, cache_timeout: CACHE_TIMEOUT, base_url: BASE_URL });