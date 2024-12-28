import axios from "axios";
import { lookup } from "mime-types";

import { DatovaSluzba, DistribuceSluzba, DistribuceSoubor } from "otevrene-formalni-normy-dts";
import { BASE_URL, ENDPOINT } from "../constants";
import { fixUrl, getFormat, httpsAgent } from "../functions";
import { KatalogResourceShow } from "../schema/katalog";

type CommonFileOrService = {
  iri: string;
  název: { cs: string };
  podmínky_užití: {
    typ: "Specifikace podmínek užití";
    autorské_dílo: string;
    databáze_chráněná_zvláštními_právy: string;
    databáze_jako_autorské_dílo: string;
    osobní_údaje: string;
  };
};

export async function getResource(id: string) {
  const sr = await axios
    .get<KatalogResourceShow>(`${ENDPOINT}/resource_show?id=${id}`, {
      responseType: "json",
      httpsAgent,
      timeout: 10000,
    })
    .then((res) => res.data.result);

  const iri = BASE_URL + "/resource/" + sr.id;

  const podmínky_užití = {
    typ: "Specifikace podmínek užití" as "Specifikace podmínek užití",
    autorské_dílo: sr.license_autorske_dilo,
    databáze_chráněná_zvláštními_právy: sr.license_zvlastni_prava_databaze,
    databáze_jako_autorské_dílo: sr.license_originalni_databaze,
    osobní_údaje: sr.license_osobni_udaje,
  };

  const název = { cs: sr.title };

  const commonData: CommonFileOrService = {
    iri,
    název,
    podmínky_užití,
  };

  if (sr.service_endpointURL || sr.service_endpointDescription) {
    return getServiceDistribution(sr, commonData);
  } else {
    return getFileDistribution(sr, commonData);
  }
}

function getServiceDistribution(sr: KatalogResourceShow["result"], data: CommonFileOrService) {
  const přístupová_služba: DatovaSluzba & { iri: string } = {
    iri: data.iri + "/sluzba",
    typ: "Datová služba",
    název: data.název,
    přístupový_bod: fixUrl(sr.service_endpointURL) || fixUrl(sr.service_endpointDescription),
    popis_přístupového_bodu: fixUrl(sr.service_endpointDescription),
  };

  const distribution: DistribuceSluzba = {
    ...data,
    typ: "Distribuce",
    přístupové_url: fixUrl(sr.accessURL) || fixUrl(sr.service_endpointURL) || fixUrl(sr.service_endpointDescription),
    přístupová_služba,
  };

  return distribution;
}

function getFileDistribution(sr: KatalogResourceShow["result"], data: CommonFileOrService) {
  const soubor_ke_stažení = fixUrl(sr.downloadURL);
  const formát = sr.format
    ? getFormat(sr.format)
    : "http://publications.europa.eu/resource/authority/file-type/unknown";

  let typ_média: string = "";
  let mime: string | false = false;

  if (!mime) mime = sr.mimetype || lookup(sr.format?.toLowerCase());
  if (!mime) mime = lookup(soubor_ke_stažení);

  if (mime) typ_média = "http://www.iana.org/assignments/media-types/" + mime;
  else typ_média = "http://www.iana.org/assignments/media-types/application/octet-stream";

  const distribution: DistribuceSoubor = {
    ...data,
    typ: "Distribuce",
    formát,
    typ_média,
    soubor_ke_stažení,
    přístupové_url: fixUrl(sr.accessURL),
    schéma: sr.conformsTo,
  };

  return distribution;
}
