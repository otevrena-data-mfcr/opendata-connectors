import fastify from "fastify";
import { PORT } from "./constants";
import { getCatalog } from "./controllers/catalog";
import { getDataset } from "./controllers/dataset";
import { getResource } from "./controllers/resource";

export class App {

  async start() {

    const server = fastify({
      maxParamLength: 1800,
    });

    server.get("/", async (req, res) => {
      return getCatalog();
    })

    server.get<{ Params: { id: string } }>("/resource/:id", async (req, res) => {
      return getResource(req.params.id);
    })

    server.get<{ Params: { id: string } }>("/:id", async (req, res) => {
      return getDataset(req.params.id);
    })

    await server.listen(PORT, "0.0.0.0");
    console.log(`Listening on port ${PORT}`);
  }
}
