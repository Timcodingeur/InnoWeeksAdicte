import express from "express";
import { Lootbox, Recompense, User } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { auth } from "../auth/auth.mjs";

const lootboxRouter = express.Router();

// Route pour récupérer toutes les lootboxes
lootboxRouter.get("/", auth, async (req, res) => {
  try {
    const lootboxes = await Lootbox.findAll({ order: [["createdAt", "DESC"]] });
    res.json(success("La liste des lootboxes a bien été récupérée.", lootboxes));
  } catch (error) {
    res.status(500).json({ message: "La liste des lootboxes n'a pas pu être récupérée. Merci de réessayer dans quelques instants.", data: error });
  }
});

// Route pour ouvrir une lootbox et récupérer une récompense aléatoire, coûtant des points à l'utilisateur
lootboxRouter.post('/:id/ouvrir', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`Opening lootbox with ID: ${id} for user ID: ${userId}`);

    const lootbox = await Lootbox.findByPk(id);
    if (!lootbox) {
      console.log("Lootbox not found");
      return res.status(404).json({ message: "Lootbox non trouvée." });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.point < lootbox.prix) {
      console.log("Insufficient points");
      return res.status(403).json({ message: "Points insuffisants pour ouvrir cette lootbox." });
    }

    user.point -= lootbox.prix;
    await user.save();
    console.log(`Points deducted, new balance: ${user.point}`);

    const recompenses = await Recompense.findAll();
    if (recompenses.length === 0) {
      console.log("No rewards available");
      return res.status(404).json({ message: "Aucune récompense disponible." });
    }

    const indexAleatoire = Math.floor(Math.random() * recompenses.length);
    const recompenseAleatoire = recompenses[indexAleatoire];
    console.log(`Reward selected: ${recompenseAleatoire.nom}`);

    res.json(success("Lootbox ouverte avec succès.", { recompense: recompenseAleatoire, pointsRestants: user.point }));
  } catch (error) {
    console.error('Erreur lors de l\'ouverture:', error);
    res.status(500).json({ message: "Erreur lors de l'ouverture de la lootbox.", data: error });
  }
});


export { lootboxRouter };
