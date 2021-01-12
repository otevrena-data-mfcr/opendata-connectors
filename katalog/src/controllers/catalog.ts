import axios from "axios";
import { Katalog, OVM } from "otevrene-formalni-normy-dts";

import { BASE_URL, ENDPOINT } from "../constants";
import { KatalogPackageList } from "../schema/katalog";
import { httpsAgent } from "../functions";

export async function getCatalog() {
  const catalog: Katalog = {
    "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
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

  catalog.datová_sada = await axios.get<KatalogPackageList>(`${ENDPOINT}/package_list`, { responseType: "json", httpsAgent, timeout: 10000 })
    .then(res => res.data.result.map(datasetId => BASE_URL + "/" + datasetId));

  return catalog;

}