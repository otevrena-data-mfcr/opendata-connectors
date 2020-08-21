import axios from "axios";
import { snakeCase, sentenceCase } from "change-case";

import { createServer } from "./server";

import { Entity, DatovaSada, Frequency, RuianStat, Theme, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, Katalog, OVM, Distribuce } from "otevrene-formalni-normy-dts";
import { CedrEndpoint } from "./schema/cedr-endpoint";

import { sparqlDataset, sparqlDistribution } from "./entities/sparql";
import { catalog } from "./entities/catalog";

const BASE_URL = process.env["BASE_URL"] || "";
const PORT = process.env["PORT"] ? Number(process.env["PORT"]) : 3000;
const CACHE_TIMEOUT = Number(process.env["CACHE_TIMEOUT"]) || 30;

const endpoints = [
  { name: "cedr", url: "https://cedropendata.mfcr.cz/c3lod/cedr/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fcedr%23cedrDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" },
  { name: "mmr", url: "https://cedropendata.mfcr.cz/c3lod/mmr/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fmmr%23mmrDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" },
  { name: "csu", url: "https://cedropendata.mfcr.cz/c3lod/csu/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fcsu%23csuDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" },
  { name: "szcr", url: "https://cedropendata.mfcr.cz/c3lod/szcr/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fszcr%23szcrDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" },
  { name: "ruian", url: "https://cedropendata.mfcr.cz/c3lod/ruian/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fruian%23ruianDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" },
  { name: "edssmvs", url: "https://cedropendata.mfcr.cz/c3lod/edssmvs/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fedssmvs%23edssmvsDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" },
  { name: "ares", url: "https://cedropendata.mfcr.cz/c3lod/ares/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fares%23aresDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" },
  { name: "rob", url: "https://cedropendata.mfcr.cz/c3lod/rob/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Frob%23robDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" },
  { name: "isdp", url: "https://cedropendata.mfcr.cz/c3lod/isdp/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fisdp%23isdpDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson" }
];

var fileTypeIndex: { [type: string]: { fileType: string, mediaType: string } } = {
  "n3": {
    fileType: "http://publications.europa.eu/resource/authority/file-type/RDF_N_TRIPLES",
    mediaType: "http://www.iana.org/assignments/media-types/application/n-triples",
  },
  "csv": {
    fileType: "http://publications.europa.eu/resource/authority/file-type/CSV",
    mediaType: "http://www.iana.org/assignments/media-types/text/csv",
  }
}

async function fetchEntities(): Promise<Entity[]> {

  const datasets: DatovaSada[] = [
    sparqlDataset
  ];

  for (let endpoint of endpoints) {
    datasets.push(...await getDatasets(endpoint));
  }

  catalog.datová_sada = datasets.map(ds => ds.iri);

  const distributions = datasets.map(ds => ds.distribuce).reduce((acc, cur) => ([...acc, ...cur]));

  return [
    catalog,
    ...datasets,
    ...distributions,
  ];

}
async function getDatasets(endpointMeta: { name: string, url: string }): Promise<DatovaSada[]> {

  const endpoint: CedrEndpoint = await axios.get(endpointMeta.url, { responseType: "json" })
    .then(res => res.data[0]);

  const endpointDataset: DatovaSada = {
    "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
    iri: BASE_URL + "/" + endpointMeta.name,
    typ: "Datová sada",
    distribuce: [],
    klíčové_slovo: { "cs": ["dotace"] },
    název: endpoint["http://purl.org/dc/terms/title"].reduce((acc, cur) => (acc[cur["@language"]] = cur["@value"], acc), {} as { [lang: string]: string }),
    periodicita_aktualizace: Frequency.Unknown,
    popis: endpoint["http://purl.org/dc/terms/description"].reduce((acc, cur) => (acc[cur["@language"]] = cur["@value"], acc), {} as { [lang: string]: string }),
    poskytovatel: OVM.GFŘ,
    prvek_rúian: [RuianStat.CeskaRepublika],
    téma: [Theme.Government, Theme.Economics],
    dokumentace: "https://cedropendata.mfcr.cz/c3lod/C3_OpenData - datová sada IS CEDR III.pdf"
  }

  const datasets: DatovaSada[] = [
    endpointDataset
  ];

  /* Main datasets */

  if (!endpoint["http://rdfs.org/ns/void#dataDump"]) return datasets;

  endpoint["http://rdfs.org/ns/void#dataDump"].forEach(sd => {

    const urlParts = sd["@id"].match(/^https:\/\/cedropendata.mfcr.cz\/c3lod\/(.+)\.(n3|csv)\.gz$/);
    if (!urlParts) return;

    const id = urlParts[1];
    const name = sentenceCase(snakeCase(id.replace(/_/g, " dataset name delimiter ")).replace(/_/g, " ")).replace("dataset name delimiter", "-").replace(/v(\d+)$/, ", v$1");
    const type = urlParts[2];
    const iri_dataset = BASE_URL + "/" + id;
    const iri_resource = BASE_URL + "/" + id + "/" + type;

    let dataset: DatovaSada | undefined = datasets.find(item => item.iri === iri_dataset);

    if (!dataset) {
      dataset = {
        "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
        iri: iri_dataset,
        typ: "Datová sada",
        distribuce: [],
        klíčové_slovo: { "cs": ["dotace"] },
        název: { "cs": "CEDR - " + name },
        periodicita_aktualizace: Frequency.Unknown,
        popis: { "cs": "" },
        poskytovatel: OVM.GFŘ,
        prvek_rúian: [RuianStat.CeskaRepublika],
        téma: [Theme.Government, Theme.Economics],
        dokumentace: "https://cedropendata.mfcr.cz/c3lod/C3_OpenData - datová sada IS CEDR III.pdf"
      };
      datasets.push(dataset);
    }

    const distribuce: Distribuce = {
      iri: iri_resource,
      typ: "Distribuce",
      formát: fileTypeIndex[type].fileType,
      typ_média: fileTypeIndex[type].mediaType,
      typ_média_komprese: "http://www.iana.org/assignments/media-types/application/gzip",
      podmínky_užití: {
        typ: "Specifikace podmínek užití",
        autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
        databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
        databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.CCBY40,
        osobní_údaje: PodminkyUzitiOsobniUdaje.ObsahujeOsobniUdaje,
      },
      přístupové_url: sd["@id"],
      soubor_ke_stažení: sd["@id"],
    }

    dataset.distribuce.push(distribuce);

  });

  return datasets;
}

createServer(fetchEntities, { port: PORT, cache_timeout: CACHE_TIMEOUT, base_url: BASE_URL });