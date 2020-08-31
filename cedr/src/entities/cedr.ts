import { DatovaSada, OVM, Theme, RuianStat, Frequency } from "otevrene-formalni-normy-dts";

const BASE_URL = process.env["BASE_URL"] || "";

export const cedrDataset: DatovaSada = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/cedr",
  typ: "Datová sada",
  název: { "cs": "Centrální evidence dotací" },
  popis: { "cs": "CEDR III, Centrální evidence dotací z rozpočtu nebo také Centrální registr dotací, je databáze obsahující údaje o dotacích,návratných finančních výpomocích a dalších podobných transferech poskytovaných ze státního rozpočtu, státních fondů, státníchfinančních aktiv a Národního fondu (včetně evropských dotací) a jejich příjemcích.", },
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