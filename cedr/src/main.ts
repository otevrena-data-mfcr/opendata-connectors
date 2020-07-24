import axios from "axios";

import { DatovaSada, Frequency, RuianStat, Theme, PodminkyUzitiDilo, PodminkyUzitiDatabazeZvlastni, PodminkyUzitiDatabazeDilo, PodminkyUzitiOsobniUdaje, DistribuceSoubor } from "../../../otevrene-formalni-normy-dts";
import { CedrEndpoint } from "./schema/cedr-endpoint";

(async function () {

  const cedrEndpoint: CedrEndpoint = await axios.get("https://cedropendata.mfcr.cz/c3lod/cedr/sparql?query=DESCRIBE%20%3Chttp%3A%2F%2Fcedropendata.mfcr.cz%2Fc3lod%2Fcedr%23cedrDataSet%3E&describe-mode=CBD&format=application%2Fld%2Bjson", { responseType: "json" })
    .then(res => res.data[0]);

  const datasets: DatovaSada[] = [];

  /* Main datasets */
  cedrEndpoint["http://rdfs.org/ns/void#dataDump"].forEach(sd => {

    const urlParts = sd["@id"].match(/^https:\/\/cedropendata.mfcr.cz\/c3lod\/(.+)\.(n3|csv)\.gz$/);
    if (!urlParts) return;

    const iri = "https://cedropendata.mfcr.cz/c3lod/" + urlParts[1];

    let dataset: DatovaSada | undefined = datasets.find(item => item.iri === iri);

    if (!dataset) {
      dataset = {
        "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
        iri: iri,
        typ: "Datová sada",
        distribuce: [],
        klíčové_slovo: { "cs": ["dotace"] },
        název: { "cs": "CEDR - " + urlParts[1] },
        periodicita_aktualizace: Frequency.Unknown,
        popis: { "cs": "" },
        poskytovatel: "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/00006947",
        prvek_rúian: [RuianStat.CeskaRepublika],
        téma: [Theme.Government, Theme.Economics],
        dokumentace: "https://cedropendata.mfcr.cz/c3lod/C3_OpenData - datová sada IS CEDR III.pdf"
      };
      datasets.push(dataset);
    }

    dataset.distribuce.push({
      formát: "http://publications.europa.eu/resource/authority/file-type/" + urlParts[2].toUpperCase(),
      iri: sd["@id"],
      typ: "Distribuce",
      podmínky_užití: {
        typ: "Specifikace podmínek užití",
        autorské_dílo: PodminkyUzitiDilo.NeobsahujeAutorskaDila,
        databáze_chráněná_zvláštními_právy: PodminkyUzitiDatabazeZvlastni.NeniChranenaZvlastnimPravem,
        databáze_jako_autorské_dílo: PodminkyUzitiDatabazeDilo.NeniChranenouDatabazi,
        osobní_údaje: PodminkyUzitiOsobniUdaje.ObsahujeOsobniUdaje,
      },
      přístupové_url: sd["@id"],
      soubor_ke_stažení: sd["@id"],     
      typ_média: "http://www.iana.org/assignments/media-types/text/" + urlParts[2],
    })
  });

  console.log(datasets[3]);

})();