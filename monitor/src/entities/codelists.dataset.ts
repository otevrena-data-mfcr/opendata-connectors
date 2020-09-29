import { DatovaSada, OVM, Theme, RuianStat, Frequency } from "otevrene-formalni-normy-dts";
import { monitorDataset } from "./monitor-dataset";

const BASE_URL = process.env["BASE_URL"] || "";

export const codelistsDataset: DatovaSada = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/ciselniky",
  typ: "Datová sada",
  název: {
    "cs": "Číselníky z aplikace MONITOR Státní pokladny",
    "en": "Codelists from MONITOR Státní pokladny"
  },
  popis: {
    "cs": "Číselníky používané v aplikaci MONITOR státní pokladny.",
    "en": "Codelists used in the application MONITOR Státní pokladny."
  },
  poskytovatel: OVM.MF,
  téma: [
    Theme.Economics, Theme.Government
  ],
  periodicita_aktualizace: Frequency.Irreg, //nejmensi z podrizenych
  klíčové_slovo: {
    "cs": ["státní pokladna", "rozpočet"],
    "en": ["treasury", "budget"]
  },
  prvek_rúian: [RuianStat.CeskaRepublika],
  je_součástí: monitorDataset.iri 
}