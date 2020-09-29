import { Entity, DatovaSada, Distribuce } from "otevrene-formalni-normy-dts";

import { createServer } from "opendata-connectors-common";

import { soapDataset } from "./entities/soap";
import { catalog } from "./entities/catalog";
import { monitorDataset } from "./entities/monitor-dataset";
import { getTransactionDatasets } from "./transaction-datasets";
import { BASE_URL, CACHE_TIMEOUT, PORT } from "./const";
import { getCodelistDatasets } from "./codelist-datasets";

async function fetchEntities(): Promise<Entity[]> {

  const datasets: DatovaSada[] = [
    monitorDataset,
    soapDataset,
  ];

  datasets.push(...await getTransactionDatasets());

  datasets.push(...await getCodelistDatasets());

  catalog.datová_sada = datasets.map(ds => ds.iri);

  return [

    // main dcat:catalog record
    catalog,

    // dcat:dataset records
    ...datasets,

    // dcat:distribution records
    ...datasets.reduce((acc, val) => acc.concat(val.distribuce || []), [] as Distribuce[])

  ]

}

createServer(fetchEntities, { port: PORT, cache_timeout: CACHE_TIMEOUT, base_url: BASE_URL });