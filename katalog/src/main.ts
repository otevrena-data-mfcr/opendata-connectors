import axios from "axios";
import https from "https";

import { createServer } from "opendata-connectors-common";

import { Entity, OVM, RuianStat, Theme, Frequency } from "otevrene-formalni-normy-dts";
import { ENDPOINT, BASE_URL, PORT, CACHE_TIMEOUT } from "./constants";
import { type2mime, license2iri, theme2iri, frequency2iri } from "./conversions";
import { catalog } from "./entities";
import { KatalogPackageList, KatalogPackageShow, KatalogResourceShow } from "./schema/katalog";
import { PartialDistribuce, PartialDistribuceSoubor, PartialDatovaSada } from "./schema/partial-ofn";



const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});



async function fetchEntities(): Promise<Entity[]> {

  const datasets: PartialDatovaSada[] = [];
  const distributions: PartialDistribuce[] = [];

  const datasetIds = await axios.get<KatalogPackageList>(`${ENDPOINT}/package_list`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

  for (let id of datasetIds) {

    process.stdout.write(".");

    const sd = await axios.get<KatalogPackageShow>(`${ENDPOINT}/package_show?id=${id}`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

    const resources = sd.distribution?.map(item => item.id) || [];
    const datasetDistributions: PartialDistribuceSoubor[] = [];

    for (let url of resources) {

      const sr = await axios.get<KatalogResourceShow>(`${ENDPOINT}/resource_show?id=${url}`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

      let typ_média: string | undefined = undefined;

      if (sr.mimetype) typ_média = "http://www.iana.org/assignments/media-types/" + sr.mimetype;
      else if (type2mime[sr.format?.toLowerCase()]) typ_média = "http://www.iana.org/assignments/media-types/" + type2mime[sr.format.toLowerCase()];

      const downloadURL = encodeURI(decodeURIComponent(sr.downloadURL)); // fix badly encoded URIs
      const accessURL = encodeURI(decodeURIComponent(sr.accessURL)); // fix badly encoded URIs

      const distribution: PartialDistribuceSoubor = {
        iri: BASE_URL + "/" + sd.name + "/" + sr.id,
        typ: "Distribuce",
        název: { "cs": sr.name },
        formát: "http://publications.europa.eu/resource/authority/file-type/" + sr.format?.toUpperCase(),
        soubor_ke_stažení: downloadURL,
        typ_média,
        podmínky_užití: {
          typ: "Specifikace podmínek užití",
          autorské_dílo: license2iri.license_autorske_dilo[sr.license_autorske_dilo],
          databáze_chráněná_zvláštními_právy: license2iri.license_zvlastni_prava_databaze[sr.license_zvlastni_prava_databaze],
          databáze_jako_autorské_dílo: license2iri.license_originalni_databaze[sr.license_originalni_databaze],
          osobní_údaje: license2iri.license_osobni_udaje[sr.license_osobni_udaje]
        },
        přístupové_url: accessURL
      };

      datasetDistributions.push(distribution);
    }

    const dataset: PartialDatovaSada = {
      "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
      iri: BASE_URL + "/" + sd.name,
      typ: "Datová sada",
      název: { "cs": sd.title, },
      popis: { "cs": sd.description ? sd.description.replace(/(<([^>]+)>)/g, "") : "" },
      poskytovatel: OVM.MF,
      téma: [theme2iri[sd.theme] || Theme.Government],
      periodicita_aktualizace: frequency2iri[sd.accrualPeriodicity],
      klíčové_slovo: { "cs": sd.tags?.split(",").map(item => item.trim()) || [] },
      prvek_rúian: [sd.spatial],
      distribuce: datasetDistributions,
      je_součástí: sd.isPartOf
    };

    distributions.push(...datasetDistributions);
    datasets.push(dataset);

  }

  process.stdout.write("\r\n");

  catalog.datová_sada = datasets.map(ds => ds.iri);

  return [
    catalog,
    ...datasets,
    ...distributions
  ];
}

createServer(fetchEntities, { port: PORT, cache_timeout: CACHE_TIMEOUT, base_url: BASE_URL });