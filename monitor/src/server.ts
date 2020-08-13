import http from "http";
import { Entity } from "otevrene-formalni-normy-dts";

interface ServerOptions {
  port: number;
  cache_timeout: number;
  base_url: string;
}
const defaultOptions: ServerOptions = {
  port: 3000,
  cache_timeout: 30,
  base_url: ""
}

export async function createServer(entitiesCallback: () => Promise<Entity[]>, userOptions: Partial<ServerOptions> = {}) {

  const options = Object.assign({}, defaultOptions, userOptions);

  var timestamp: Date = new Date();

  var index: { [iri: string]: Entity } = {};

  async function updateEntities() {

    console.log("Loading entities...");
    const entities = await entitiesCallback();
    console.log(`Found ${entities.length} entities.`);

    index = entities.reduce((acc, cur) => (acc[cur.iri] = cur, acc), {} as { [iri: string]: Entity });

    timestamp = new Date();
  }

  await updateEntities();

  const server = http.createServer(async (req, res) => {

    if ((new Date()).getTime() - timestamp.getTime() > options.cache_timeout * 1000) {
      try {
        await updateEntities();
      }
      catch (err) {
        console.log(err);
      }
    }

    const iri = options.base_url + req.url;

    console.log("Request:", iri);

    if (index[iri]) {
      res.writeHead(200, { 'Content-Type': 'application/ld+json' });
      res.write(JSON.stringify(index[iri]));
    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
    }

    res.end();

  });

  server.listen(options.port, () => {
    console.log(`Server listening on port ${options.port}`);
  });

}