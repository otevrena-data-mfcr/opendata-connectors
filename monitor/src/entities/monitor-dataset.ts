import { DatovaSada, OVM, Theme, RuianStat, Frequency } from "otevrene-formalni-normy-dts";

const BASE_URL = process.env["BASE_URL"] || "";

export const monitorDataset: DatovaSada = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/MONITOR",
  typ: "Datová sada",
  název: { "cs": "MONITOR Státní pokladny" },
  popis: { "cs": "MONITOR je specializovaný informační portál Ministerstva financí, který umožňuje veřejnosti volný přístup k rozpočtovým a účetním informacím ze všech úrovní státní správy a samosprávy. Prezentované informace pocházejí ze systému Státní pokladny (IISSP – Integrovaný informační systém státní pokladny) a Centrálního systému účetních informací (CSÚIS) a jsou čtvrtletně aktualizovány.", },
  poskytovatel: OVM.MF,
  téma: [
    Theme.Economics, Theme.Government
  ],
  periodicita_aktualizace: Frequency.Monthly, //nejmensi z podrizenych
  klíčové_slovo: {
    "cs": ["státní pokladna", "rozpočet"],
    "en": ["treasury", "budget"]
  },
  prvek_rúian: [RuianStat.CeskaRepublika]
}