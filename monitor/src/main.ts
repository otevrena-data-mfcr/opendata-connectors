import axios from "axios";
import http from "http";
import { DateTime, Duration } from "luxon";

import { MonitorDataset } from "./schema/monitor-dataset";
import { Katalog, DatovaSada, OVM, RuianStat, Theme, Frequency, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje } from "otevrene-formalni-normy-dts";

const BASE_URL = process.env["BASE_URL"] || "";

var catalog: Katalog = {
  "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  iri: BASE_URL,
  typ: "Katalog",

  název: {
    "cs": "Monitor Státní pokladny",
  },
  popis: { "cs": "" },
  poskytovatel: OVM.MF,
  domovská_stránka: "https://monitor.statnipokladna.cz",
  datová_sada: []
};

var datasets: DatovaSada[] = [];

async function updateSource() {

  console.log("Loading datasets...");
  const sourceDatasets: MonitorDataset[] = await axios.get("https://monitor.statnipokladna.cz/data/dataset.json", { responseType: "json" }).then(res => res.data);

  datasets = sourceDatasets.map(sd => {

    const periodicityIndex: { [key: string]: Frequency } = {
      "R/P1M": Frequency.Monthly,
      "R/P3M": Frequency.Quarterly,
      "R/P1Y": Frequency.Annual
    };

    const urlParts = sd.distribution[0].downloadURL.match(/^https:\/\/monitor.statnipokladna.cz\/data\/extrakty\/[^\/]+\/(.*)\..+$/);
    const id = urlParts![1];


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
        "cs": ["státní pokladna", "rozpočet"]
      },
      prvek_rúian: [RuianStat.CeskaRepublika],
      časové_rozlišení: sd.accrualPeriodicity,
      distribuce: sd.distribution.map(dist => ({
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
      }))

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

    return dataset;
  });

  catalog.datová_sada = datasets.map(ds => ds.iri);

  console.log(`Found ${datasets.length} datasets.`);

}


(async function () {

  await updateSource();

  const server = http.createServer((req, res) => {

    console.log(req.url);

    if (req.url === "" || req.url === "/") {
      res.writeHead(200, { 'Content-Type': 'application/ld+json' });
      res.write(JSON.stringify(catalog));
    }
    else {
      const iri = BASE_URL + req.url;
      const dataset = datasets.find(item => item.iri === iri);
      if (dataset) {
        res.writeHead(200, { 'Content-Type': 'application/ld+json' });
        res.write(JSON.stringify(dataset));
      }
      else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
      }
    }

    res.end();
  });



  server.listen(3000);

})();