import express from "express";
import { Task, User } from "../models/index.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const tasksRouter = express.Router();

// Route pour récupérer toutes les tâches
tasksRouter.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        assignedUserId: {
          [Op.is]: null
        }
      },
      order: [["created", "DESC"]]
    });
    const message = "La liste des tâches non assignées a bien été récupérée.";
    res.json(success(message, tasks));
  } catch (error) {
    const message = "La liste des tâches non assignées n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer une tâche par ID
tasksRouter.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: User, as: "assignedUser" }]
    });
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
// Route pour récupérer les tâches assignées à un utilisateur spécifique
tasksRouter.get("/assigned/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.findAll({
      where: {
        assignedUserId: userId
      },
      order: [["created", "DESC"]]
    });
    const message = "La liste des tâches assignées a bien été récupérée.";
    res.json(success(message, tasks));
  } catch (error) {
    const message = "La liste des tâches assignées n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
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
    const updatedTask = await Task.findByPk(taskId, {
      include: [{ model: User, as: "assignedUser" }]
    });
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

// Route pour créer une nouvelle attribution (ancienne association de tâches à des utilisateurs)
tasksRouter.post("/:taskId/assign", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    const task = await Task.findByPk(taskId);
    if (!task) {
      const message = "La tâche demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await task.update({ assignedUserId: userId });
    const message = "La tâche a bien été assignée à l'utilisateur.";
    res.json(success(message, task));
  } catch (error) {
    const message = "La tâche n'a pas pu être assignée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer toutes les attributions d'une tâche (non nécessaire avec la nouvelle association directe)
tasksRouter.get("/:taskId/assign", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId, {
      include: [{ model: User, as: "assignedUser" }]
    });
    if (!task) {
      const message = "La tâche demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = "Les attributions de la tâche ont bien été récupérées.";
    res.json(success(message, task));
  } catch (error) {
    const message = "Les attributions n'ont pas pu être récupérées. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { tasksRouter };
