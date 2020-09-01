/**
 * CKAN API data does not satisfy OFN, output of this module is not OFN valid. We have to introduce Partial types to satisfy contstraintsa
 */

import { DatovaSada, DistribuceSluzba, DistribuceSoubor } from "otevrene-formalni-normy-dts";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface PartialDatovaSada extends Omit<DatovaSada, "distribuce"> {
  distribuce?: PartialDistribuce[];
}

export type PartialDistribuce = PartialDistribuceSoubor | DistribuceSluzba;

export type PartialDistribuceSoubor = PartialBy<DistribuceSoubor, "typ_média">;
