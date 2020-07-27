import http from "http";
import axios from "axios";
import { snakeCase, sentenceCase } from "change-case";

import { DatovaSada, Frequency, RuianStat, Theme, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, Katalog, OVM } from "otevrene-formalni-normy-dts";
import { CedrEndpoint } from "./schema/cedr-endpoint";

const BASE_URL = process.env["BASE_URL"] || "";

const endpoints = [
  "https://cedropendata.mfcr.cz/c3lod/cedr/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fcedr%23cedrDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson",
  "https://cedropendata.mfcr.cz/c3lod/mmr/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fmmr%23mmrDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson",
  "https://cedropendata.mfcr.cz/c3lod/csu/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fcsu%23csuDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson",
  "https://cedropendata.mfcr.cz/c3lod/szcr/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fszcr%23szcrDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson",
  "https://cedropendata.mfcr.cz/c3lod/ruian/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fruian%23ruianDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson",
  "https://cedropendata.mfcr.cz/c3lod/edssmvs/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fedssmvs%23edssmvsDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson",
  "https://cedropendata.mfcr.cz/c3lod/ares/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fares%23aresDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson",
  "https://cedropendata.mfcr.cz/c3lod/rob/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Frob%23robDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson",
  "https://cedropendata.mfcr.cz/c3lod/isdp/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fisdp%23isdpDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson"
];

var catalog: Katalog = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/",
  typ: "Katalog",

  název: {
    "cs": "Centrální registr dotací",
  },
  popis: { "cs": "" },
  poskytovatel: OVM.GFŘ,
  domovská_stránka: "https://cedropendata.mfcr.cz",
  datová_sada: []
};

var datasets: DatovaSada[] = [];

async function updateSource() {
  datasets = [];

  for (let endpoint of endpoints) {
    datasets.push(...await getDatasets(endpoint));
  }

  catalog.datová_sada = datasets.map(ds => ds.iri);

  console.log(`Found ${datasets.length} datasets.`);

}
async function getDatasets(endpoint: string): Promise<DatovaSada[]> {

  const cedrEndpoint: CedrEndpoint = await axios.get(endpoint, { responseType: "json" })
    .then(res => res.data[0]);

  const endpointDatasets: DatovaSada[] = [];

  /* Main datasets */

  if (!cedrEndpoint["http://rdfs.org/ns/void#dataDump"]) return [];

  cedrEndpoint["http://rdfs.org/ns/void#dataDump"].forEach(sd => {

    const urlParts = sd["@id"].match(/^https:\/\/cedropendata.mfcr.cz\/c3lod\/(.+)\.(n3|csv)\.gz$/);
    if (!urlParts) return;

    const id = urlParts[1];
    const name = sentenceCase(snakeCase(id.replace(/_/g, " dataset name delimiter ")).replace(/_/g, " ")).replace("dataset name delimiter", "-").replace(/v(\d+)$/, ", v$1");
    const type = urlParts[2];
    const iri_dataset = BASE_URL + "/" + id;
    const iri_resource = BASE_URL + "/" + id + "/" + type;

    let dataset: DatovaSada | undefined = endpointDatasets.find(item => item.iri === iri_dataset);

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
      endpointDatasets.push(dataset);
    }

    dataset.distribuce.push({
      formát: "http://publications.europa.eu/resource/authority/file-type/" + type.toUpperCase(),
      iri: iri_resource,
      typ: "Distribuce",
      podmínky_užití: {
        typ: "Specifikace podmínek užití",
        autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
        databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
        databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.NeniChranenouDatabazi,
        osobní_údaje: PodminkyUzitiOsobniUdaje.ObsahujeOsobniUdaje,
      },
      přístupové_url: sd["@id"],
      soubor_ke_stažení: sd["@id"],
      typ_média: "http://www.iana.org/assignments/media-types/text/" + urlParts[2],
    })
  });

  return endpointDatasets;

}

(async function () {

  await updateSource();

  const server = http.createServer((req, res) => {

    console.log(req.url);

    if (req.url === "" || req.url === "/") {
      res.writeHead(200, { 'Content-Type': 'application/ld+json' });
      res.write(JSON.stringify(catalog));
    }
    else {
      const iri = BASE_URL + req.url;
      const dataset = datasets.find(item => item.iri === iri);
      if (dataset) {
        res.writeHead(200, { 'Content-Type': 'application/ld+json' });
        res.write(JSON.stringify(dataset));
      }
      else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
      }
    }

    res.end();
  });

  server.listen(3000);

})();