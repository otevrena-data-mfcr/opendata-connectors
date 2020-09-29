export interface MonitorCodelist {
  active: boolean;          // example: true
  columns: string[];        // example: []
  dateDependant: boolean;   // example: false
  dbTable: string;          // example: "d_aktorg"
  deleted: boolean;         // example: false
  descriptionCS: string;    // example: "Číselník stavů organizací"
  descriptionEN: string;    // example: "The code list of organization´s states."
  enableBrowsing: boolean;  // example: true
  id: number;               // example: 1
  sort: string;             // example: "aktorg_id"
  titleCS: string;          // example: "Aktivní organizace"
  titleEN: string;          // example: "Active organization"
  uri: string;              // example: null
  xml: string;              // example: "aktorg.xml"
  xsd: string;              // example: "monitorAktorg.xsd"
}