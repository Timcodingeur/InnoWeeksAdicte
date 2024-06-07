import express from "express";
import { Task, User, Attribuer } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const tasksRouter = express.Router();

// Route pour récupérer toutes les tâches
tasksRouter.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({ order: [["created", "DESC"]] });
    const message = "La liste des tâches a bien été récupérée.";
    res.json(success(message, tasks));
  } catch (error) {
    const message = "La liste des tâches n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer une tâche par ID
tasksRouter.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      const message = "La tâche demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `La tâche dont l'id vaut ${task.id} a bien été récupérée.`;
    res.json(success(message, task));
  } catch (error) {
    const message = "La tâche n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer une nouvelle tâche
tasksRouter.post("/", auth, async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    const message = "Une nouvelle tâche a bien été créée.";
    res.json(success(message, newTask));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "La tâche n'a pas pu être créée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour une tâche
tasksRouter.put("/:id", auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.update(req.body, { where: { id: taskId } });
    const updatedTask = await Task.findByPk(taskId);
    if (!updatedTask) {
      const message = "La tâche demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = "La tâche a bien été mise à jour.";
    res.json(success(message, updatedTask));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    const message = "La tâche n'a pas pu être mise à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer une tâche
tasksRouter.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      const message = "La tâche demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Task.destroy({ where: { id: req.params.id } });
    const message = "La tâche a bien été supprimée.";
    res.json(success(message, task));
  } catch (error) {
    const message = "La tâche n'a pas pu être supprimée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer une nouvelle attribution
tasksRouter.post("/:taskId/assign", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    const newAttribution = await Attribuer.create({ idTask: taskId, idUser: userId });
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

// Route pour récupérer toutes les attributions d'une tâche
tasksRouter.get("/:taskId/assign", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const attributions = await Attribuer.findAll({
      where: { idTask: taskId },
      include: [{ model: User, as: "userDetails" }],
    });
    const message = "La liste des attributions a bien été récupérée.";
    res.json(success(message, attributions));
  } catch (error) {
    const message = "La liste des attributions n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour une attribution
tasksRouter.put("/:taskId/assign/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Attribuer.update(req.body, { where: { id } });
    const updatedAttribution = await Attribuer.findByPk(id);
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
tasksRouter.delete("/:taskId/assign/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const attribution = await Attribuer.findByPk(id);
    if (!attribution) {
      const message = "L'attribution demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Attribuer.destroy({ where: { id } });
    const message = "L'attribution a bien été supprimée.";
    res.json(success(message, attribution));
  } catch (error) {
    const message = "L'attribution n'a pas pu être supprimée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { tasksRouter };
