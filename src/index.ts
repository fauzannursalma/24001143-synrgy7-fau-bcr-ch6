import express, { Express } from "express";

import swaggerUi from "swagger-ui-express";
import swagggerDocument from "../swagger.json";

// import swaggerDocs from "./utils/swagger";

import { Model } from "objection";
import { config } from "dotenv";

config();

import knexInstance from "./db";
import router from "./routes";

const stringPORT = process.env.PORT;
const PORT = stringPORT ? parseInt(stringPORT) : 8000;

const app: Express = express();

Model.knex(knexInstance);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagggerDocument));

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>BCR</title>
      </head>
      <body>
        <h1>Binar Car Rental</h1>
      </body>
    </html>
  `);
});

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    status: "error",
    message: "Not found",
  });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
