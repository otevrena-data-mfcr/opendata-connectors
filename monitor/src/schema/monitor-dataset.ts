import { MonitorDistribution } from "./monitor-distribution";

export interface MonitorDataset {
  bureauCode: any[];
  accessLevel: string;

  contactPoint: {},

  description: string;

  publisher: {
    name: string
  },

  modified: string,

  accrualPeriodicity: string,

  distribution: MonitorDistribution[],

  title: string,

  spatial: string
}

