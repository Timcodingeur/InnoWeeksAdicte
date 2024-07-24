import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";


import { sequelize } from './models/index.mjs';
import { chatRouter } from './routes/chat.mjs';
import { clansRouter } from './routes/clans.mjs';
import { lootboxRouter } from './routes/lootbox.mjs';
import { recompensesRouter } from './routes/recompenses.mjs';
import { tasksRouter } from './routes/tasks.mjs';
import { usersRouter } from './routes/users.mjs';
import { titreRouter } from './routes/titre.mjs';
import { typeEvenementRouter } from './routes/typeEvenement.mjs';
import { evenementRouter } from './routes/evenement.mjs';
import { pointRouter } from './routes/point.mjs';
import { battlePassRouter } from './routes/battlePass.mjs';


import { initDb } from "./db/sequelize.mjs";
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
app.use('/chat', chatRouter);
app.use('/clans', clansRouter);
app.use('/lootbox', lootboxRouter);
app.use('/recompenses', recompensesRouter);
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);
app.use('/titres', titreRouter);
app.use('/types-evenement', typeEvenementRouter);
app.use('/evenements', evenementRouter);
app.use('/points', pointRouter);
app.use('/battle-passes', battlePassRouter);

// Écoute du serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});

// Gestionnaire pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: "Ressource demandée non trouvée ! Vous pouvez essayer une autre URL." });
});
