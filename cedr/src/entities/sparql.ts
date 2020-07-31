
import { DatovaSada, DatovaSluzba, DistribuceSluzba, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, Frequency, OVM, RuianStat, Theme } from "otevrene-formalni-normy-dts";

const BASE_URL = process.env["BASE_URL"] || "";

export const sparqlDistribution: DistribuceSluzba = {
  iri: BASE_URL + "/sparql/sluzba",
  typ: "Distribuce",
  podmínky_užití: {
    typ: "Specifikace podmínek užití",
    autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
    databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
    databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.CCBY40,
    osobní_údaje: PodminkyUzitiOsobniUdaje.ObsahujeOsobniUdaje
  },
  název: {
    "cs": "SPARQL REST API - Rozhraní pro dotazování na data v datové sadě IS CEDR III",
  },
  přístupové_url: "https://cedropendata.mfcr.cz/c3lod/cedr/sparql",
  přístupová_služba: {
    typ: "Datová služba",
    název: {
      "cs": "SPARQL REST API - Rozhraní pro dotazování na data v datové sadě IS CEDR III",
    },
    přístupový_bod: "https://cedropendata.mfcr.cz/c3lod/cedr/sparql",
    popis_přístupového_bodu: "https://cedr.mfcr.cz/cedr3internetv419/OpenData/DocumentationPage.aspx/#zalozka3"
  }
};

export const sparqlDataset: DatovaSada = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  typ: "Datová sada",
  iri: BASE_URL + "/sparql",
  distribuce: [
    sparqlDistribution
  ],
  klíčové_slovo: {
    "cs": ["cedr", "dotace"]
  },
  název: { "cs": "SPARQL REST API - Rozhraní pro dotazování na data v datové sadě IS CEDR III" },
  periodicita_aktualizace: Frequency.Irreg,
  popis: { "cs": "CEDR III, Centrální evidence dotací z rozpočtu nebo také Centrální registr dotací, je databáze obsahující údaje o dotacích,návratných finančních výpomocích a dalších podobných transferech poskytovaných ze státního rozpočtu, státních fondů, státníchfinančních aktiv a Národního fondu (včetně evropských dotací) a jejich příjemcích. \n Data jsou publikována v nejvyšším stupni 5. dle specifikace [2] otevřenosti datových sad jako propojená data." },
  poskytovatel: OVM.GFŘ,
  prvek_rúian: [RuianStat.CeskaRepublika],
  dokumentace: "https://cedropendata.mfcr.cz/c3lod/C3_OpenData - datová sada IS CEDR III.pdf",
  téma: [Theme.Government]
};
