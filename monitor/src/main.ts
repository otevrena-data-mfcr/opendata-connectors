import axios from "axios";
import { DateTime, Duration } from "luxon";

import { MonitorDataset } from "./schema/monitor-dataset";
import { Entity, DatovaSada, OVM, RuianStat, Theme, Frequency, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, Distribuce, DatovaSluzba } from "otevrene-formalni-normy-dts";
import { createServer } from "./server";
import { soapDataset, soapDistribution } from "./entities/soap";
import { catalog } from "./entities/catalog";
import { monitorDataset } from "./entities/monitor-dataset";

const BASE_URL = process.env["BASE_URL"] || "";
const PORT = process.env["PORT"] ? Number(process.env["PORT"]) : 3000;
const CACHE_TIMEOUT = Number(process.env["CACHE_TIMEOUT"]) || 30;

async function fetchEntities(): Promise<Entity[]> {

  const datasets: DatovaSada[] = [
    soapDataset,
    monitorDataset
  ];
  const distributions: Distribuce[] = [
    soapDistribution
  ];

  const sourceDatasets: MonitorDataset[] = await axios.get("https://monitor.statnipokladna.cz/data/dataset.json", { responseType: "json" }).then(res => res.data);

  for (let sd of sourceDatasets) {

    const periodicityIndex: { [key: string]: Frequency } = {
      "R/P1M": Frequency.Monthly,
      "R/P3M": Frequency.Quarterly,
      "R/P1Y": Frequency.Annual
    };

    const urlParts = sd.distribution[0].downloadURL.match(/^https:\/\/monitor.statnipokladna.cz\/data\/extrakty\/[^\/]+\/([^\/]+)\/(.*)\..+$/);
    if (urlParts === null) continue;

    const dateParts = urlParts[2].match(/(\d{4})_(\d{2})_/);

    const parentIri = BASE_URL + "/" + urlParts[1];
    const datasetIri = parentIri + "/" + urlParts[2];
    const distributionIri = datasetIri + "/csv";

    const name = sd.title
      .replace(/ \- (\d{2}\/)?\d{4}$/, "")
      .replace(/^(.+?) - /, "");

    const datasetName = "MONITOR: " + name + (dateParts ? ` za období ${dateParts[2]}/${dateParts[1]}` : "");
    const parentName = "MONITOR: " + name;

    let parentDataset: DatovaSada | undefined = datasets.find(item => item.iri === parentIri);

    if (!parentDataset) {
      parentDataset = {
        "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
        iri: parentIri,
        typ: "Datová sada",
        název: { "cs": parentName },
        popis: { "cs": sd.description },
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
        je_součástí: monitorDataset.iri,
        časové_rozlišení: sd.accrualPeriodicity ? sd.accrualPeriodicity.replace("R/", "") : undefined
      };

      datasets.push(parentDataset);
    }

    const distribuce = sd.distribution.map(dist => ({
      iri: distributionIri,
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
      iri: datasetIri,
      typ: "Datová sada",
      název: { "cs": datasetName },
      popis: { "cs": sd.description, },
      poskytovatel: OVM.MF,
      téma: [
        Theme.Economics, Theme.Government
      ],
      periodicita_aktualizace: Frequency.Never,
      klíčové_slovo: {
        "cs": ["státní pokladna", "rozpočet"],
        "en": ["treasury", "budget"]
      },
      prvek_rúian: [RuianStat.CeskaRepublika],
      časové_rozlišení: sd.accrualPeriodicity ? sd.accrualPeriodicity.replace("R/", "") : undefined,
      je_součástí: parentDataset.iri,
      distribuce

    };

    const timeSpanMatch = sd.distribution[0].downloadURL.match(/(\d{4})_(\d{2})/);

    if (timeSpanMatch && sd.accrualPeriodicity) {

      const to = DateTime.fromObject({ year: Number(timeSpanMatch[1]), month: Number(timeSpanMatch[2]), day: 1 }).endOf("month");
      const from = to.plus({ days: 1 }).minus(Duration.fromISO(sd.accrualPeriodicity.replace("R/", "")));

      dataset.časové_pokrytí = {
        typ: "Časový interval",
        začátek: from.toISODate()!, // if matched by regexp then date is not invalid and iso string not null
        konec: to.toISODate()! // if matched by regexp then date is not invalid and iso string not null
      };
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