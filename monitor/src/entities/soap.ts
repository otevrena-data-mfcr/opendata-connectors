//https://monitor.statnipokladna.cz/api/monitorws

import { DatovaSada, DistribuceSluzba, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, Frequency, OVM, RuianStat, Theme } from "otevrene-formalni-normy-dts";

const BASE_URL = process.env["BASE_URL"] || "";

export const soapDistribution: DistribuceSluzba = {
  iri: BASE_URL + "/soap/sluzba",
  typ: "Distribuce",
  podmínky_užití: {
    typ: "Specifikace podmínek užití",
    autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
    databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
    databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.CCBY40,
    osobní_údaje: PodminkyUzitiOsobniUdaje.ObsahujeOsobniUdaje
  },
  přístupová_služba: {
    typ: "Datová služba",
    název: { "cs": "MONITOR: Webová služba SOAP" },
    přístupový_bod: "https://monitor.statnipokladna.cz/api/monitorws",
    popis_přístupového_bodu: "https://monitor.statnipokladna.cz/datovy-katalog/webova-sluzby"
  },
  přístupové_url: "https://monitor.statnipokladna.cz/api/monitorws",

}

export const soapDataset: DatovaSada = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/soap",
  typ: "Datová sada",
  název: { "cs": "MONITOR: Webová služba SOAP" },
  klíčové_slovo: { "cs": ["státní pokladna", "rozpočet"] },
  periodicita_aktualizace: Frequency.Monthly,
  popis: { "cs": "" },
  poskytovatel: OVM.MF,
  prvek_rúian: [RuianStat.CeskaRepublika],
  téma: [Theme.Government, Theme.Economics],
  distribuce: [
    soapDistribution
  ]
}