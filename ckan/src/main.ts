import axios from "axios";
import https from "https";

import { createServer } from "opendata-connectors-common";

import { Entity, Katalog, DatovaSada, OVM, RuianStat, Theme, Frequency, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, DistribuceSoubor, Distribuce } from "otevrene-formalni-normy-dts";
import { CKANPackageList, CKANPackageShow } from "./schema/ckan-api";
import { PartialBy, PartialDistribuce, PartialDistribuceSoubor, PartialDatovaSada } from "./schema/partial-ofn";

const ENDPOINT = process.env["ENDPOINT"] || "http://localhost";
const BASE_URL = process.env["BASE_URL"] || "";
const PORT = process.env["PORT"] ? Number(process.env["PORT"]) : 3000;
const CACHE_TIMEOUT = Number(process.env["CACHE_TIMEOUT"]) || 30;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const catalog: Katalog = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/",
  typ: "Katalog",

  název: {
    "cs": "Katalog otevřených dat MF",
  },
  popis: { "cs": "" },
  poskytovatel: OVM.MF,
  domovská_stránka: "https://data.mfcr.cz",
  datová_sada: []
};

const type2mime: { [type: string]: string } = {
  "csv": "text/csv",
  "json": "application/json",
  "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "xls": "application/vnd.ms-excel",
  "zip": "application/zip"
}

async function fetchEntities(): Promise<Entity[]> {

  const datasets: PartialDatovaSada[] = [];
  const distributions: PartialDistribuce[] = [];

  const datasetIds = await axios.get<CKANPackageList>(`${ENDPOINT}/package_list`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

  for (let id of datasetIds) {

    process.stdout.write(".");

    const sd = await axios.get<CKANPackageShow>(`${ENDPOINT}/package_show?id=${id}`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

    const resources = sd.resources || [];
    const datasetDistributions: PartialDistribuceSoubor[] = [];

    for (let sr of resources) {

      let typ_média: string | undefined = undefined;
      if (sr.mimetype) typ_média = "http://www.iana.org/assignments/media-types/" + sr.mimetype;
      if (type2mime[sr.format.toLowerCase()]) typ_média = "http://www.iana.org/assignments/media-types/" + type2mime[sr.format.toLowerCase()];

      const url = encodeURI(decodeURIComponent(sr.url)); // fix badly encoded URIs

      const distribution: PartialDistribuceSoubor = {
        iri: BASE_URL + "/" + sd.name + "/" + sr.id,
        typ: "Distribuce",
        název: { "cs": sr.name },
        formát: "http://publications.europa.eu/resource/authority/file-type/" + sr.format.toUpperCase(),
        soubor_ke_stažení: sr.url,
        typ_média,
        podmínky_užití: {
          typ: "Specifikace podmínek užití",
          autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
          databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
          databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.NeniChranenouDatabazi,
          osobní_údaje: PodminkyUzitiOsobniUdaje.NeobsahujeOsobniUdaje
        },
        přístupové_url: sr.url
      };

      datasetDistributions.push(distribution);
    }

    const dataset: PartialDatovaSada = {
      "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
      iri: BASE_URL + "/" + sd.name,
      typ: "Datová sada",
      název: { "cs": sd.title, },
      popis: { "cs": sd.notes ? sd.notes.replace(/(<([^>]+)>)/g, "") : "" },
      poskytovatel: OVM.MF,
      téma: [Theme.Government],
      periodicita_aktualizace: Frequency.Unknown, // TODO: překlad frekvencí z katalogu, je potřeba vyexportovat do API
      klíčové_slovo: {
        "cs": sd.tags ? sd.tags.map(tag => tag.name) : []
      },
      prvek_rúian: [RuianStat.CeskaRepublika],
      distribuce: datasetDistributions
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