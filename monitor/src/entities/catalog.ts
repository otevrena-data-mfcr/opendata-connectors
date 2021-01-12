import { Katalog, OVM } from "otevrene-formalni-normy-dts";

const BASE_URL = process.env["BASE_URL"] || "";

export const catalog: Katalog = {
  "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/",
  typ: "Katalog",

  název: {
    "cs": "MONITOR Státní pokladny",
  },
  popis: { "cs": "Data z aplikace MONITOR státní pokladny. Rozpočtové a účetní informace ze všech úrovní státní správy a samosprávy" },
  poskytovatel: OVM.MF,
  domovská_stránka: "https://monitor.statnipokladna.cz",
  datová_sada: []
};