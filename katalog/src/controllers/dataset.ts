import axios from "axios";
import { DatovaSada, OVM, Theme } from "otevrene-formalni-normy-dts";

import { ENDPOINT, BASE_URL } from "../constants";
import { KatalogPackageShow } from "../schema/katalog";
import { httpsAgent } from "../functions";
import { getResource } from "./resource";

export async function getDataset(id: string) {

  const sd = await axios.get<KatalogPackageShow>(`${ENDPOINT}/package_show?id=${id}`, { responseType: "json", httpsAgent, timeout: 10000 }).then(res => res.data.result);

  const dataset: DatovaSada = {
    "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
    iri: BASE_URL + "/" + sd.name,
    typ: "Datová sada",
    název: { "cs": sd.title, },
    popis: { "cs": sd.description ? sd.description.replace(/(<([^>]+)>)/g, "") : "" },
    poskytovatel: sd.publisher || OVM.MF,
    téma: [sd.theme || Theme.Government],
    periodicita_aktualizace: sd.accrualPeriodicity,
    klíčové_slovo: { "cs": sd.tags?.split(",").map(item => item.trim()) || [] },
    prvek_rúian: [sd.spatial],
    koncept_euroVoc: [sd.eurovoc],
    specifikace: sd.conformsTo,
    dokumentace: sd.page,
    distribuce: [],
  };

  if (sd.isPartOf) dataset.je_součástí = BASE_URL + "/" + sd.isPartOf;

  const resources = sd.distribution?.map(item => item.id) || [];

  for (let resourceId of resources) {

    const distribution = await getResource(resourceId);

    if (distribution) dataset.distribuce?.push(distribution)

  }

  return dataset;

}
