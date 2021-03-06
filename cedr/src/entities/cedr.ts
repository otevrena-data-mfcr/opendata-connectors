import { DatovaSada, OVM, Theme, RuianStat, Frequency } from "otevrene-formalni-normy-dts";

const BASE_URL = process.env["BASE_URL"] || "";

export const cedrDataset: DatovaSada = {
  "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/cedr",
  typ: "Datová sada",
  název: { "cs": "CEDR - Centrální evidence dotací", "en": "CEDR - Central Grants Registry" },
  popis: { "cs": "Centrální evidence dotací ze státního rozpočtu, státních fondů, státních finančních aktiv a Národního fondu (včetně evropských dotací)", },
  poskytovatel: OVM.GFŘ,
  téma: [Theme.Government],
  periodicita_aktualizace: Frequency.Monthly, //nejmensi z podrizenych
  klíčové_slovo: { "cs": ["dotace"], "en": ["grants"] },
  dokumentace: "https://cedropendata.mfcr.cz/c3lod/C3_OpenData%20-%20datová%20sada%20IS%20CEDR%20III.pdf",
  prvek_rúian: [RuianStat.CeskaRepublika]
}