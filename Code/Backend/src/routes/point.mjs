import express from 'express';
import { Point, Task } from '../models/index.mjs';
import { success } from './helper.mjs';
import { auth } from '../auth/auth.mjs';

const pointRouter = express.Router();

// Route pour récupérer tous les points
pointRouter.get('/', auth, async (req, res) => {
  try {
    const points = await Point.findAll();
    const message = 'La liste des points a bien été récupérée.';
    res.json(success(message, points));
  } catch (error) {
    const message = "La liste des points n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer un point par ID
pointRouter.get('/:id', auth, async (req, res) => {
  try {
    const point = await Point.findByPk(req.params.id);
    if (!point) {
      const message = "Le point demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le point dont l'id vaut ${point.id} a bien été récupéré.`;
    res.json(success(message, point));
  } catch (error) {
    const message = "Le point n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer un nouveau point
pointRouter.post('/', auth, async (req, res) => {
  try {
    const createdPoint = await Point.create(req.body);
    const message = `Le point ${createdPoint.typeDePoint} a bien été créé !`;
    res.json(success(message, createdPoint));
  } catch (error) {
    const message = "Le point n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour un point
pointRouter.put('/:id', auth, async (req, res) => {
  try {
    const pointId = req.params.id;
    await Point.update(req.body, { where: { id: pointId } });
    const updatedPoint = await Point.findByPk(pointId);
    if (!updatedPoint) {
      const message = "Le point demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le point ${updatedPoint.typeDePoint} a bien été modifié.`;
    res.json(success(message, updatedPoint));
  } catch (error) {
    const message = "Le point n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer un point
pointRouter.delete('/:id', auth, async (req, res) => {
  try {
    const point = await Point.findByPk(req.params.id);
    if (!point) {
      const message = "Le point demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Point.destroy({ where: { id: point.id } });
    const message = `Le point ${point.typeDePoint} a bien été supprimé.`;
    res.json(success(message, point));
  } catch (error) {
    const message = "Le point n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { pointRouter };
