import { Katalog, OVM } from "otevrene-formalni-normy-dts";
import { BASE_URL } from "./constants";

export const catalog: Katalog = {
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