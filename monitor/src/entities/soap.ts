//https://monitor.statnipokladna.cz/api/monitorws

import { DatovaSada, DistribuceSluzba, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, Frequency, OVM, RuianStat, Theme, DatovaSluzba } from "otevrene-formalni-normy-dts";
import { monitorDataset } from "./monitor-dataset";

const BASE_URL = process.env["BASE_URL"] || "";

export const SoapService: DatovaSluzba = {
  iri: BASE_URL + "/soap/sluzba",
  typ: "Datová služba",
  název: {
    "cs": "Webová služba SOAP",
    "en": "SOAP API"
  },
  přístupový_bod: "https://monitor.statnipokladna.cz/api/monitorws",
  popis_přístupového_bodu: "https://monitor.statnipokladna.cz/datovy-katalog/webova-sluzba",
}

export const soapDistribution: DistribuceSluzba = {
  iri: BASE_URL + "/soap/sluzba-distribuce",
  typ: "Distribuce",
  podmínky_užití: {
    typ: "Specifikace podmínek užití",
    autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
    databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
    databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.CCBY40,
    osobní_údaje: PodminkyUzitiOsobniUdaje.ObsahujeOsobniUdaje
  },
  přístupová_služba: SoapService,
  přístupové_url: "https://monitor.statnipokladna.cz/api/monitorws",

}

export const soapDataset: DatovaSada = {
  "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/soap",
  typ: "Datová sada",
  název: {
    "cs": "Webová služba SOAP aplikace MONITOR Státní pokladny",
    "en": "SOAP API for MONITOR Státní pokladny"
  },
  klíčové_slovo: { "cs": ["státní pokladna", "rozpočet"] },
  periodicita_aktualizace: Frequency.Monthly,
  popis: {
    "cs": "Webová služba SOAP aplikace MONITOR Státní pokladny",
    "en": "SOAP API for MONITOR Státní pokladny"
  },
  poskytovatel: OVM.MF,
  prvek_rúian: [RuianStat.CeskaRepublika],
  téma: [Theme.Government, Theme.Economics],
  distribuce: [
    soapDistribution
  ],
  je_součástí: monitorDataset.iri
}