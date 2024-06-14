import express from "express";
import { Lootbox, Recompense, Contenir, Obtenir } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const lootboxRouter = express.Router();

// Route pour récupérer toutes les lootbox
lootboxRouter.get("/", auth, async (req, res) => {
  try {
    const lootboxes = await Lootbox.findAll({ order: [["created", "DESC"]] });
    const message = "La liste des lootboxes a bien été récupérée.";
    res.json(success(message, lootboxes));
  } catch (error) {
    const message = "La liste des lootboxes n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});


lootboxRouter.get("image/:image", auth, async (req, res) => {
  try {
    let Image=req.params.image;

    res.json(success());
  } catch (error) {
    const message = "L'image n'a pas pu être recupéré'";
    res.status(500).json({ message, data: error });
  }
});
// Route pour récupérer une lootbox par ID
lootboxRouter.get("/:id", auth, async (req, res) => {
  try {
    const lootbox = await Lootbox.findByPk(req.params.id, {
      include: [{ model: Recompense, through: Contenir, as: "recompenses" }],
    });
    if (!lootbox) {
      const message = "La lootbox demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `La lootbox dont l'id vaut ${lootbox.id} a bien été récupérée.`;
    res.json(success(message, lootbox));
  } catch (error) {
    const message = "La lootbox n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer une nouvelle lootbox
lootboxRouter.post("/", auth, async (req, res) => {
  try {
    const newLootbox = await Lootbox.create(req.body);
    const message = "Une nouvelle lootbox a bien été créée.";
    res.json(success(message, newLootbox));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "La lootbox n'a pas pu être créée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});
// Route pour ouvrir une lootbox et récupérer les récompenses
// Route pour ouvrir une lootbox et récupérer une récompense aléatoire
lootboxRouter.post("/:id/ouvrir", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const lootbox = await Lootbox.findByPk(id, {
      include: [{ model: Recompense, as: "recompenses" }],
    });
    if (!lootbox) {
      const message = "La lootbox demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    
    // Sélectionner une récompense aléatoire
    const recompenses = lootbox.recompenses;
    if (recompenses.length === 0) {
      const message = "Cette lootbox ne contient aucune récompense.";
      return res.status(404).json({ message });
    }
    const recompenseAleatoire = recompenses[Math.floor(Math.random() * recompenses.length)];
    
    const message = `La lootbox dont l'id vaut ${lootbox.id} a bien été ouverte.`;
    res.json(success(message, { recompense: recompenseAleatoire }));
  } catch (error) {
    const message = "La lootbox n'a pas pu être ouverte. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});


// Route pour mettre à jour une lootbox
lootboxRouter.put("/:id", auth, async (req, res) => {
  try {
    const lootboxId = req.params.id;
    await Lootbox.update(req.body, { where: { id: lootboxId } });
    const updatedLootbox = await Lootbox.findByPk(lootboxId);
    if (!updatedLootbox) {
      const message = "La lootbox demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = "La lootbox a bien été mise à jour.";
    res.json(success(message, updatedLootbox));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "La lootbox n'a pas pu être mise à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer une lootbox
lootboxRouter.delete("/:id", auth, async (req, res) => {
  try {
    const lootbox = await Lootbox.findByPk(req.params.id);
    if (!lootbox) {
      const message = "La lootbox demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Lootbox.destroy({ where: { id: req.params.id } });
    const message = "La lootbox a bien été supprimée.";
    res.json(success(message, lootbox));
  } catch (error) {
    const message = "La lootbox n'a pas pu être supprimée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour ajouter une récompense à une lootbox
lootboxRouter.post("/:id/recompenses", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { recompenseId } = req.body;
    const lootbox = await Lootbox.findByPk(id);
    if (!lootbox) {
      const message = "La lootbox demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const recompense = await Recompense.findByPk(recompenseId);
    if (!recompense) {
      const message = "La récompense demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await lootbox.addRecompense(recompense);
    const message = "La récompense a bien été ajoutée à la lootbox.";
    res.json(success(message, lootbox));
  } catch (error) {
    const message = "La récompense n'a pas pu être ajoutée à la lootbox. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer une récompense d'une lootbox
lootboxRouter.delete("/:id/recompenses/:recompenseId", auth, async (req, res) => {
  try {
    const { id, recompenseId } = req.params;
    const lootbox = await Lootbox.findByPk(id);
    if (!lootbox) {
      const message = "La lootbox demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const recompense = await Recompense.findByPk(recompenseId);
    if (!recompense) {
      const message = "La récompense demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await lootbox.removeRecompense(recompense);
    const message = "La récompense a bien été supprimée de la lootbox.";
    res.json(success(message, lootbox));
  } catch (error) {
    const message = "La récompense n'a pas pu être supprimée de la lootbox. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { lootboxRouter };
