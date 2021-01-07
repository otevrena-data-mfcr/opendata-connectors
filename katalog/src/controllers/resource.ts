import axios from "axios";
import { lookup } from "mime-types";

import { DatovaSluzba, DistribuceSluzba, DistribuceSoubor } from "otevrene-formalni-normy-dts";
import { ENDPOINT, BASE_URL } from "../constants";
import { KatalogResourceShow } from "../schema/katalog";
import { fixUrl, httpsAgent } from "../functions";

export async function getResource(id: string) {

  const sr = await axios.get<KatalogResourceShow>(`${ENDPOINT}/resource_show?id=${id}`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

  const iri = BASE_URL + "/resource/" + sr.id;

  let typ_média: string = "";

  const mime = sr.mimetype || lookup(sr.format?.toLowerCase());
  if (mime) typ_média = "http://www.iana.org/assignments/media-types/" + mime;

  const podmínky_užití = {
    typ: "Specifikace podmínek užití" as "Specifikace podmínek užití",
    autorské_dílo: sr.license_autorske_dilo,
    databáze_chráněná_zvláštními_právy: sr.license_zvlastni_prava_databaze,
    databáze_jako_autorské_dílo: sr.license_originalni_databaze,
    osobní_údaje: sr.license_osobni_udaje
  };

  const název = { "cs": sr.title };

  if (sr.service_endpointURL || sr.service_endpointDescription) {

    const service: DatovaSluzba & { iri: string } = {
      iri: iri + "/sluzba",
      typ: "Datová služba",
      název,
      přístupový_bod: fixUrl(sr.service_endpointURL) || fixUrl(sr.service_endpointDescription),
      popis_přístupového_bodu: fixUrl(sr.service_endpointDescription)
    };

    const distribution: DistribuceSluzba = {
      iri,
      typ: "Distribuce",
      název,
      podmínky_užití,
      přístupové_url: fixUrl(sr.accessURL) || fixUrl(sr.service_endpointURL) || fixUrl(sr.service_endpointDescription),
      přístupová_služba: service
    };

    return distribution;

  }
  else {

    const distribution: DistribuceSoubor = {
      iri,
      typ: "Distribuce",
      název,
      formát: "http://publications.europa.eu/resource/authority/file-type/" + sr.format?.toUpperCase(),
      typ_média,
      podmínky_užití,
      soubor_ke_stažení: fixUrl(sr.downloadURL),
      přístupové_url: fixUrl(sr.accessURL)
    };

    return distribution;

  }
}