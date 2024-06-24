import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

// Import des routes
import { clansRouter } from "./routes/clans.mjs";
import { lootboxRouter } from "./routes/lootbox.mjs";
import { recompensesRouter } from "./routes/recompenses.mjs";
import { tasksRouter } from "./routes/tasks.mjs";
import { usersRouter } from "./routes/users.mjs";
import { chatRouter } from './routes/chat.mjs';

// Configuration de la base de données et importation du Swagger
import { sequelize, initDb } from "./db/sequelize.mjs";
import { swaggerSpec } from "./swagger.mjs";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

// Documentation Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// Connexion à la base de données
sequelize.authenticate()
  .then(() => console.log("La connexion à la base de données a bien été établie"))
  .catch((error) => console.error("Impossible de se connecter à la DB"));

// Initialisation de la base de données
initDb();

// Routes principales
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API REST de notre service !");
});

app.use("/api/clans", clansRouter);
app.use("/api/lootbox", lootboxRouter);
app.use("/api/recompenses", recompensesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use('/api/chat', chatRouter);

// Écoute du serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});

// Gestionnaire pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: "Ressource demandée non trouvée ! Vous pouvez essayer une autre URL." });
});
