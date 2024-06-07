import express from "express";
import { Obtenir, User, Recompense } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const obtenirRouter = express.Router();

// Route pour récupérer toutes les attributions
obtenirRouter.get("/", auth, async (req, res) => {
  try {
    const attributions = await Obtenir.findAll({
      include: [
        { model: User, as: "userDetails" },
        { model: Recompense, as: "recompenseDetails" }
      ],
      order: [["created", "DESC"]],
    });
    const message = "La liste des attributions a bien été récupérée.";
    res.json(success(message, attributions));
  } catch (error) {
    const message = "La liste des attributions n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer une attribution par ID
obtenirRouter.get("/:id", auth, async (req, res) => {
  try {
    const attribution = await Obtenir.findByPk(req.params.id, {
      include: [
        { model: User, as: "userDetails" },
        { model: Recompense, as: "recompenseDetails" }
      ]
    });
    if (!attribution) {
      const message = "L'attribution demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `L'attribution dont l'id vaut ${attribution.id} a bien été récupérée.`;
    res.json(success(message, attribution));
  } catch (error) {
    const message = "L'attribution n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer une nouvelle attribution
obtenirRouter.post("/", auth, async (req, res) => {
  try {
    const newAttribution = await Obtenir.create(req.body);
    const message = "Une nouvelle attribution a bien été créée.";
    res.json(success(message, newAttribution));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "L'attribution n'a pas pu être créée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour une attribution
obtenirRouter.put("/:id", auth, async (req, res) => {
  try {
    const attributionId = req.params.id;
    await Obtenir.update(req.body, { where: { id: attributionId } });
    const updatedAttribution = await Obtenir.findByPk(attributionId);
    if (!updatedAttribution) {
      const message = "L'attribution demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = "L'attribution a bien été mise à jour.";
    res.json(success(message, updatedAttribution));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "L'attribution n'a pas pu être mise à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer une attribution
obtenirRouter.delete("/:id", auth, async (req, res) => {
  try {
    const attribution = await Obtenir.findByPk(req.params.id);
    if (!attribution) {
      const message = "L'attribution demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Obtenir.destroy({ where: { id: req.params.id } });
    const message = "L'attribution a bien été supprimée.";
    res.json(success(message, attribution));
  } catch (error) {
    const message = "L'attribution n'a pas pu être supprimée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { obtenirRouter };
