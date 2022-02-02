export interface KatalogPackageList {
  help: string;
  success: boolean;
  result: string[];
}

export interface KatalogPackageShow {
  "help": string,
  "success": boolean,
  "result": {
    "id": string,
    "name": string,
    "title": string,
    "publisher": string,
    "description": string,
    "theme": string,

    "accrualPeriodicity": string,
    "tags": string,
    "spatial": string,
    "temporal_startDate": string,
    "temporal_endDate": string,
    "eurovoc": string,

    "contactPoint": string,
    "page": string,
    "conformsTo": string,
    "spatialResolutionInMeters": string,
    "temporalResolution": string,
    "isPartOf": string,
    "distribution": { id: string }[]
  }
}

export interface KatalogResourceShow {
  "help": string,
  "success": boolean,
  "result": {
    "id": string,
    "title": string,
    "license_autorske_dilo": string,
    "license_originalni_databaze": string,
    "license_zvlastni_prava_databaze": string,
    "license_osobni_udaje": string,
    "downloadURL": string,
    "accessURL": string,
    "format": string,
    "mimetype": string,
    "conformsTo": string,
    "compressFormat": string,
    "packageFormat": string,
    "service_endpointURL": string,
    "service_endpointDescription": string
  }
}
