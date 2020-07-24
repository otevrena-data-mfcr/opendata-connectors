export interface CedrEndpoint {

  '@id': 'http://cedropendata.mfcr.cz/c3lod/cedr#cedrDataSet';
  '@type': ['http://rdfs.org/ns/void#Dataset'];

  'http://purl.org/dc/terms/created': { '@type': 'http://www.w3.org/2001/XMLSchema#dateTime', '@value': string; }[];

  'http://purl.org/dc/terms/description': { '@language': string, '@value': string }[],

  'http://purl.org/dc/terms/license': { '@id': string }[]

  'http://purl.org/dc/terms/modified': { '@type': 'http://www.w3.org/2001/XMLSchema#dateTime', '@value': '2020-04-28T00:00:00.000Z' }[],

  'http://purl.org/dc/terms/publisher': { '@id': string }[]

  'http://purl.org/dc/terms/title': { '@language': string, '@value': string }[];

  'http://purl.org/dc/terms/valid': { '@type': 'http://www.w3.org/2001/XMLSchema#dateTime', '@value': string }[],

  'http://rdfs.org/ns/void#dataDump': CedrDataset[];

  'http://rdfs.org/ns/void#exampleResource': CedrExampleResource[];

  'http://rdfs.org/ns/void#sparqlEndpoint': [
    { '@id': string },
    { '@id': string }
  ],

  'http://rdfs.org/ns/void#triples': [
    {
      '@type': 'http://www.w3.org/2001/XMLSchema#int',
      '@value': number
    }
  ],
  'http://rdfs.org/ns/void#uriLookupEndpoint': [
    { '@id': string },
    { '@id': string }
  ],

  'http://rdfs.org/ns/void#vocabulary': [{ '@id': string }],

  'http://xmlns.com/foaf/0.1/homepage': [{ '@id': string }]
}


export interface CedrDataset {
  "@id": string;
}

export interface CedrExampleResource {
  "@id": string;
}