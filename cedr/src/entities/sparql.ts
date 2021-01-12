
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
  "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  typ: "Datová sada",
  iri: BASE_URL + "/sparql",
  distribuce: [
    sparqlDistribution
  ],
  klíčové_slovo: { "cs": ["dotace"], "en": ["grants"] },
  název: { "cs": "SPARQL REST API", "en": "SPARQL REST API" },
  periodicita_aktualizace: Frequency.Irreg,
  popis: { "cs": "Rozhraní pro dotazování na data v datové sadě IS CEDR III", },
  poskytovatel: OVM.GFŘ,
  prvek_rúian: [RuianStat.CeskaRepublika],
  dokumentace: "https://cedropendata.mfcr.cz/c3lod/C3_OpenData%20-%20datová%20sada%20IS%20CEDR%20III.pdf",
  téma: [Theme.Government],
  je_součástí: BASE_URL + "/cedr",
};

