import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { parse as parseYaml } from "yaml";
import intentRoutes from "./routes/intentRoutes.js";
import { config } from "./config/env.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
let spec;
try {
  const yamlContent = readFileSync(join(__dirname, "..", "openapi.yaml"), "utf8");
  spec = parseYaml(yamlContent);
} catch (err) {
  console.warn("OpenAPI spec load failed:", err.message);
  spec = { openapi: "3.0.3", info: { title: "Intent Layer API", version: "0.1.0" }, paths: {} };
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/intent", intentRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "intent-layer-backend" });
});

app.listen(config.port, () => {
  console.log(`Intent Layer backend running on http://localhost:${config.port}`);
  console.log(`  POST /api/intent/parse          — parse prompt → SearchIntent`);
  console.log(`  POST /api/intent/search         — intent JSON → ranked results`);
  console.log(`  POST /api/intent/search-by-prompt — prompt → intent + ranked results`);
  console.log(`  GET  /api-docs — OpenAPI Swagger UI`);
});
