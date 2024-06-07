import express from "express";
import cors from "cors";

// Import des nouvelles routes
import { clansRouter } from "./routes/clans.mjs";
import { contenirRouter } from "./routes/contenir.mjs";
import { lootboxRouter } from "./routes/lootbox.mjs";
import { obtenirRouter } from "./routes/obtenir.mjs";
import { ouvrirRouter } from "./routes/ouvrir.mjs";
import { recompensesRouter } from "./routes/recompenses.mjs";
import { tasksRouter } from "./routes/tasks.mjs";
import { usersRouter } from "./routes/users.mjs";

import { sequelize, initDb } from "./db/sequelize.mjs";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.mjs";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

sequelize
  .authenticate()
  .then(() =>
    console.log("La connexion à la base de donnée a bien été établie")
  )
  .catch((error) => console.error("Impossible de se connecter à la DB"));

initDb();

app.get("/", (req, res) => {
  res.send("API REST of self service machine !");
});

app.get("/", (req, res) => {
  res.redirect(`http://localhost:${port}`);
});

// Utilisation des nouvelles routes
app.use("/api/clans", clansRouter);
app.use("/api/contenir", contenirRouter);
app.use("/api/lootbox", lootboxRouter);
app.use("/api/obtenir", obtenirRouter);
app.use("/api/ouvrir", ouvrirRouter);
app.use("/api/recompenses", recompensesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use((req, res) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});
