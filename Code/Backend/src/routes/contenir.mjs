import express from "express";
import { Contenir, Lootbox, Recompense } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const contenirRouter = express.Router();

// Route pour récupérer toutes les relations Contenir
contenirRouter.get("/", auth, async (req, res) => {
  try {
    const contenirList = await Contenir.findAll({
      include: [
        { model: Lootbox, as: "lootboxDetails" },
        { model: Recompense, as: "recompenseDetails" },
      ],
      order: [["created", "DESC"]],
    });
    const message = "La liste des relations Contenir a bien été récupérée.";
    res.json(success(message, contenirList));
  } catch (error) {
    const message = "La liste des relations Contenir n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer une relation Contenir par ID
contenirRouter.get("/:id", auth, async (req, res) => {
  try {
    const contenir = await Contenir.findByPk(req.params.id, {
      include: [
        { model: Lootbox, as: "lootboxDetails" },
        { model: Recompense, as: "recompenseDetails" },
      ],
    });
    if (!contenir) {
      const message = "La relation Contenir demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `La relation Contenir dont l'id vaut ${contenir.id} a bien été récupérée.`;
    res.json(success(message, contenir));
  } catch (error) {
    const message = "La relation Contenir n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer une nouvelle relation Contenir
contenirRouter.post("/", auth, async (req, res) => {
  try {
    const newContenir = await Contenir.create(req.body);
    const message = "Une nouvelle relation Contenir a bien été créée.";
    res.json(success(message, newContenir));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "La relation Contenir n'a pas pu être créée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour une relation Contenir
contenirRouter.put("/:id", auth, async (req, res) => {
  try {
    const contenirId = req.params.id;
    await Contenir.update(req.body, { where: { id: contenirId } });
    const updatedContenir = await Contenir.findByPk(contenirId);
    if (!updatedContenir) {
      const message = "La relation Contenir demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = "La relation Contenir a bien été mise à jour.";
    res.json(success(message, updatedContenir));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "La relation Contenir n'a pas pu être mise à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer une relation Contenir
contenirRouter.delete("/:id", auth, async (req, res) => {
  try {
    const contenir = await Contenir.findByPk(req.params.id);
    if (!contenir) {
      const message = "La relation Contenir demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Contenir.destroy({ where: { id: req.params.id } });
    const message = "La relation Contenir a bien été supprimée.";
    res.json(success(message, contenir));
  } catch (error) {
    const message = "La relation Contenir n'a pas pu être supprimée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { contenirRouter };
