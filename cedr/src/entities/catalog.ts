import { Katalog, OVM } from "otevrene-formalni-normy-dts";

const BASE_URL = process.env["BASE_URL"] || "";

export const catalog: Katalog = {
  "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
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