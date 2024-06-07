import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Clan } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
import { privateKey } from "../auth/private_key.mjs";

const usersRouter = express.Router();

// Route pour la récupération des utilisateurs
usersRouter.get("/", auth, async (req, res) => {
  try {
    if (req.query.username) {
      if (req.query.username.length < 4) {
        const message = `Le terme de la recherche doit contenir au moins 4 caractères`;
        return res.status(400).json({ message });
      }
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;
      const users = await User.findAll({
        where: { username: { [Op.like]: `%${req.query.username}%` } },
        order: ["username"],
        limit: limit,
      });
      const message = `Il y a ${users.length} utilisateur(s) correspondant au terme de la recherche`;
      res.json(success(message, users));
    } else {
      const users = await User.findAll({ order: ["username"] });
      const message = "La liste des utilisateurs a bien été récupérée.";
      res.json(success(message, users));
    }
  } catch (error) {
    const message = "La liste des utilisateurs n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour la récupération d'un utilisateur par ID
usersRouter.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Clan, as: "clandetail" }],
    });
    if (!user) {
      const message = "L'utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `L'utilisateur dont l'id vaut ${user.id} a bien été récupéré.`;
    res.json(success(message, user));
  } catch (error) {
    const message = "L'utilisateur n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour la création d'un utilisateur
usersRouter.post("/", auth, async (req, res) => {
  try {
    const createdUser = await User.create(req.body);
    const message = `L'utilisateur ${createdUser.username} a bien été créé !`;
    res.json(success(message, createdUser));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "L'utilisateur n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour la mise à jour d'un utilisateur
usersRouter.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.update(req.body, { where: { id: userId } });
    const updatedUser = await User.findByPk(userId);
    if (!updatedUser) {
      const message = "L'utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `L'utilisateur ${updatedUser.username} a bien été modifié.`;
    res.json(success(message, updatedUser));
  } catch (error) {
    const message = "L'utilisateur n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour la suppression d'un utilisateur
usersRouter.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      const message = "L'utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await User.destroy({ where: { id: user.id } });
    const message = `L'utilisateur ${user.username} a bien été supprimé.`;
    res.json(success(message, user));
  } catch (error) {
    const message = "L'utilisateur n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour la connexion d'un utilisateur
usersRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      const message = "L'utilisateur demandé n'existe pas.";
      return res.status(404).json({ message });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      const message = "Le mot de passe est incorrect.";
      return res.status(401).json({ message });
    }
    const token = jwt.sign({ userId: user.id }, privateKey, {
      expiresIn: "1y",
    });
    const message = "L'utilisateur a été connecté avec succès.";
    res.json({ message, data: user, token });
  } catch (error) {
    const message = "Erreur lors de la connexion de l'utilisateur.";
    res.status(500).json({ message, data: error });
  }
});

export { usersRouter };
