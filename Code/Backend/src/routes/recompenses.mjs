import express from "express";
import { Recompense } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/auth.mjs";

const recompensesRouter = express.Router();

// Route pour récupérer toutes les récompenses
recompensesRouter.get("/", auth, async (req, res) => {
  try {
    const recompenses = await Recompense.findAll({ order: [["created", "DESC"]] });
    const message = "La liste des récompenses a bien été récupérée.";
    res.json(success(message, recompenses));
  } catch (error) {
    const message = "La liste des récompenses n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer une récompense par ID
recompensesRouter.get("/:id", auth, async (req, res) => {
  try {
    const recompense = await Recompense.findByPk(req.params.id);
    if (!recompense) {
      const message = "La récompense demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `La récompense dont l'id vaut ${recompense.id} a bien été récupérée.`;
    res.json(success(message, recompense));
  } catch (error) {
    const message = "La récompense n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer une nouvelle récompense
recompensesRouter.post("/", auth, async (req, res) => {
  try {
    const newRecompense = await Recompense.create(req.body);
    const message = "Une nouvelle récompense a bien été créée.";
    res.json(success(message, newRecompense));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "La récompense n'a pas pu être créée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour une récompense
recompensesRouter.put("/:id", auth, async (req, res) => {
  try {
    const recompenseId = req.params.id;
    await Recompense.update(req.body, { where: { id: recompenseId } });
    const updatedRecompense = await Recompense.findByPk(recompenseId);
    if (!updatedRecompense) {
      const message = "La récompense demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = "La récompense a bien été mise à jour.";
    res.json(success(message, updatedRecompense));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "La récompense n'a pas pu être mise à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer une récompense
recompensesRouter.delete("/:id", auth, async (req, res) => {
  try {
    const recompense = await Recompense.findByPk(req.params.id);
    if (!recompense) {
      const message = "La récompense demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Recompense.destroy({ where: { id: req.params.id } });
    const message = "La récompense a bien été supprimée.";
    res.json(success(message, recompense));
  } catch (error) {
    const message = "La récompense n'a pas pu être supprimée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { recompensesRouter };
