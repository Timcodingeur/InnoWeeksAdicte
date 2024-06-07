import express from "express";
import { Clan } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/auth.mjs";

const clansRouter = express.Router();

// Route pour récupérer tous les clans
clansRouter.get("/", auth, async (req, res) => {
  try {
    const clans = await Clan.findAll();
    const message = "La liste des clans a bien été récupérée.";
    res.json(success(message, clans));
  } catch (error) {
    const message = "La liste des clans n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer un clan par ID
clansRouter.get("/:id", auth, async (req, res) => {
  try {
    const clan = await Clan.findByPk(req.params.id);
    if (!clan) {
      const message = "Le clan demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le clan dont l'id vaut ${clan.id} a bien été récupéré.`;
    res.json(success(message, clan));
  } catch (error) {
    const message = "Le clan n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer un nouveau clan
clansRouter.post("/", auth, async (req, res) => {
  try {
    const createdClan = await Clan.create(req.body);
    const message = `Le clan ${createdClan.nom} a bien été créé !`;
    res.json(success(message, createdClan));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "Le clan n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour un clan
clansRouter.put("/:id", auth, async (req, res) => {
  try {
    const clanId = req.params.id;
    await Clan.update(req.body, { where: { id: clanId } });
    const updatedClan = await Clan.findByPk(clanId);
    if (!updatedClan) {
      const message = "Le clan demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le clan ${updatedClan.nom} a bien été modifié.`;
    res.json(success(message, updatedClan));
  } catch (error) {
    const message = "Le clan n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer un clan
clansRouter.delete("/:id", auth, async (req, res) => {
  try {
    const clan = await Clan.findByPk(req.params.id);
    if (!clan) {
      const message = "Le clan demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Clan.destroy({ where: { id: clan.id } });
    const message = `Le clan ${clan.nom} a bien été supprimé.`;
    res.json(success(message, clan));
  } catch (error) {
    const message = "Le clan n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { clansRouter };
