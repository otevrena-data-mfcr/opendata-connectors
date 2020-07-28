import axios from "axios";
import { DateTime, Duration } from "luxon";

import { MonitorDataset } from "./schema/monitor-dataset";
import { Entity, Katalog, DatovaSada, OVM, RuianStat, Theme, Frequency, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, Distribuce } from "otevrene-formalni-normy-dts";
import { createServer } from "./server";

const BASE_URL = process.env["BASE_URL"] || "";
const PORT = process.env["PORT"] ? Number(process.env["PORT"]) : 3000;
const CACHE_TIMEOUT = Number(process.env["CACHE_TIMEOUT"]) || 30;

var catalog: Katalog = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL + "/",
  typ: "Katalog",

  název: {
    "cs": "Monitor Státní pokladny",
  },
  popis: { "cs": "" },
  poskytovatel: OVM.MF,
  domovská_stránka: "https://monitor.statnipokladna.cz",
  datová_sada: []
};

async function fetchEntities(): Promise<Entity[]> {

  const datasets: DatovaSada[] = [];
  const distributions: Distribuce[] = [];

  const sourceDatasets: MonitorDataset[] = await axios.get("https://monitor.statnipokladna.cz/data/dataset.json", { responseType: "json" }).then(res => res.data);

  for (let sd of sourceDatasets) {

    const periodicityIndex: { [key: string]: Frequency } = {
      "R/P1M": Frequency.Monthly,
      "R/P3M": Frequency.Quarterly,
      "R/P1Y": Frequency.Annual
    };

    const urlParts = sd.distribution[0].downloadURL.match(/^https:\/\/monitor.statnipokladna.cz\/data\/extrakty\/[^\/]+\/(.*)\..+$/);
    const id = urlParts![1];

    const distribuce = sd.distribution.map(dist => ({
      iri: BASE_URL + "/" + id + "/csv",
      typ: "Distribuce",
      formát: "http://publications.europa.eu/resource/authority/file-type/CSV",
      typ_média_balíčku: "http://www.iana.org/assignments/media-types/application/zip",
      typ_média_komprese: "http://www.iana.org/assignments/media-types/application/zip",
      soubor_ke_stažení: dist.downloadURL,
      podmínky_užití: {
        typ: "Specifikace podmínek užití",
        autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
        databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
        databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.NeniChranenouDatabazi,
        osobní_údaje: PodminkyUzitiOsobniUdaje.NeobsahujeOsobniUdaje
      },
      typ_média: "http://www.iana.org/assignments/media-types/text/csv",
      přístupové_url: dist.downloadURL
    }) as Distribuce);

    distributions.push(...distribuce);

    const dataset: DatovaSada = {
      "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
      iri: BASE_URL + "/" + id,
      typ: "Datová sada",
      název: { "cs": sd.title, },
      popis: { "cs": sd.description, },
      poskytovatel: OVM.MF,
      téma: [
        Theme.Economics, Theme.Government
      ],
      periodicita_aktualizace: periodicityIndex[sd.accrualPeriodicity],
      klíčové_slovo: {
        "cs": ["státní pokladna", "rozpočet"],
        "en": ["treasury", "budget"]
      },
      prvek_rúian: [RuianStat.CeskaRepublika],
      časové_rozlišení: sd.accrualPeriodicity ? sd.accrualPeriodicity.replace("R/", "") : undefined,
      distribuce

    };

    const timeSpanMatch = sd.distribution[0].downloadURL.match(/(\d{4})_(\d{2})/);

    if (timeSpanMatch && sd.accrualPeriodicity) {

      const from = DateTime.fromObject({ year: Number(timeSpanMatch[1]), month: Number(timeSpanMatch[2]), day: 1 }).minus(Duration.fromISO(sd.accrualPeriodicity.replace("R/", ""))).toISODate();
      const to = DateTime.fromObject({ year: Number(timeSpanMatch[1]), month: Number(timeSpanMatch[2]), day: 1 }).minus({ months: 1 }).endOf("month").toISODate();

      if (from && to) {
        dataset.časové_pokrytí = {
          typ: "Časový interval",
          začátek: from,
          konec: to
        };
      }
    }

    datasets.push(dataset);
  }

  catalog.datová_sada = datasets.map(ds => ds.iri);

  return [
    catalog,
    ...datasets,
    ...distributions
  ]

}

createServer(fetchEntities, { port: PORT, cache_timeout: CACHE_TIMEOUT, base_url: BASE_URL });