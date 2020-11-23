import axios from "axios";
import { DatovaSada, DistribuceSluzba, DistribuceSoubor, Frequency, OVM, PodminkyUzitiDatabazeDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDilo, PodminkyUzitiOsobniUdaje, RuianStat, Theme } from "otevrene-formalni-normy-dts";
import { BASE_URL } from "./const";
import { codelistsDataset } from "./entities/codelists.dataset";
import { soapDistribution } from "./entities/soap";

import { MonitorCodelist } from "./schema/monitor-codelist";

export async function getCodelistDatasets() {

  const datasets: DatovaSada[] = [
    codelistsDataset
  ];

  const sourceDatasets = await axios.get<MonitorCodelist[]>("https://monitor.statnipokladna.cz/api/ciselniky?aktivni=true", { responseType: "json" }).then(res => res.data);

  for (let sd of sourceDatasets) {

    const xmlDistribution: DistribuceSoubor = {
      "iri": `${BASE_URL}/ciselnik-${sd.id}/xml`,
      "typ": "Distribuce",
      "podmínky_užití": {
        typ: "Specifikace podmínek užití",
        autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
        databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
        databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.NeniChranenouDatabazi,
        osobní_údaje: PodminkyUzitiOsobniUdaje.NeobsahujeOsobniUdaje
      },
      "přístupové_url": "https://monitor.statnipokladna.cz/data/xml/" + sd.xml,
      "soubor_ke_stažení": "https://monitor.statnipokladna.cz/data/xml/" + sd.xml,
      "schéma": "https://monitor.statnipokladna.cz/data/xsd/ciselniky/" + sd.xsd,
      "formát": "http://publications.europa.eu/resource/authority/file-type/XML",
      "typ_média": "http://www.iana.org/assignments/media-types/application/xml",
    };

    const dataset: DatovaSada = {
      "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
      "typ": "Datová sada",
      "název": {
        "cs": sd.titleCS,
        "en": sd.titleEN
      },
      "popis": {
        "cs": sd.descriptionCS,
        "en": sd.descriptionEN
      },
      "poskytovatel": OVM.MF,
      "iri": `${BASE_URL}/ciselnik-${sd.id}`,
      "téma": [
        Theme.Economics, Theme.Government
      ],
      "periodicita_aktualizace": Frequency.Irreg,
      "klíčové_slovo": {
        "cs": ["státní pokladna", "rozpočet"],
        "en": ["treasury", "budget"]
      },
      "prvek_rúian": [RuianStat.CeskaRepublika],
      "je_součástí": codelistsDataset.iri,
      "distribuce": [
        xmlDistribution
      ]
    };

    datasets.push(dataset);
  }

  return datasets;
}