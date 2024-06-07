import express from "express";
import { Ouvrir, User, Lootbox } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const ouvrirRouter = express.Router();

// Route pour récupérer toutes les ouvertures de lootboxes
ouvrirRouter.get("/", auth, async (req, res) => {
  try {
    const ouvertures = await Ouvrir.findAll({
      include: [
        { model: User, as: "userDetails" },
        { model: Lootbox, as: "lootboxDetails" }
      ],
      order: [["created", "DESC"]],
    });
    const message = "La liste des ouvertures a bien été récupérée.";
    res.json(success(message, ouvertures));
  } catch (error) {
    const message = "La liste des ouvertures n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer une ouverture par ID
ouvrirRouter.get("/:id", auth, async (req, res) => {
  try {
    const ouverture = await Ouvrir.findByPk(req.params.id, {
      include: [
        { model: User, as: "userDetails" },
        { model: Lootbox, as: "lootboxDetails" }
      ]
    });
    if (!ouverture) {
      const message = "L'ouverture demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `L'ouverture dont l'id vaut ${ouverture.id} a bien été récupérée.`;
    res.json(success(message, ouverture));
  } catch (error) {
    const message = "L'ouverture n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer une nouvelle ouverture
ouvrirRouter.post("/", auth, async (req, res) => {
  try {
    const newOuverture = await Ouvrir.create(req.body);
    const message = "Une nouvelle ouverture a bien été créée.";
    res.json(success(message, newOuverture));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "L'ouverture n'a pas pu être créée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour une ouverture
ouvrirRouter.put("/:id", auth, async (req, res) => {
  try {
    const ouvertureId = req.params.id;
    await Ouvrir.update(req.body, { where: { id: ouvertureId } });
    const updatedOuverture = await Ouvrir.findByPk(ouvertureId);
    if (!updatedOuverture) {
      const message = "L'ouverture demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = "L'ouverture a bien été mise à jour.";
    res.json(success(message, updatedOuverture));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "L'ouverture n'a pas pu être mise à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer une ouverture
ouvrirRouter.delete("/:id", auth, async (req, res) => {
  try {
    const ouverture = await Ouvrir.findByPk(req.params.id);
    if (!ouverture) {
      const message = "L'ouverture demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Ouvrir.destroy({ where: { id: req.params.id } });
    const message = "L'ouverture a bien été supprimée.";
    res.json(success(message, ouverture));
  } catch (error) {
    const message = "L'ouverture n'a pas pu être supprimée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { ouvrirRouter };
