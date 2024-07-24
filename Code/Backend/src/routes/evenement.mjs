import express from 'express';
import { Evenement, TypeEvenement } from '../models/index.mjs';
import { success } from './helper.mjs';
import { auth } from '../auth/auth.mjs';

const evenementRouter = express.Router();

// Route pour récupérer tous les événements
evenementRouter.get('/', auth, async (req, res) => {
  try {
    const evenements = await Evenement.findAll({
      include: [{ model: TypeEvenement, as: 'typeEvenement' }],
    });
    const message = 'La liste des événements a bien été récupérée.';
    res.json(success(message, evenements));
  } catch (error) {
    const message = "La liste des événements n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer un événement par ID
evenementRouter.get('/:id', auth, async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id, {
      include: [{ model: TypeEvenement, as: 'typeEvenement' }],
    });
    if (!evenement) {
      const message = "L'événement demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `L'événement dont l'id vaut ${evenement.id} a bien été récupéré.`;
    res.json(success(message, evenement));
  } catch (error) {
    const message = "L'événement n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer un nouvel événement
evenementRouter.post('/', auth, async (req, res) => {
  try {
    const createdEvenement = await Evenement.create(req.body);
    const message = `L'événement ${createdEvenement.nom} a bien été créé !`;
    res.json(success(message, createdEvenement));
  } catch (error) {
    const message = "L'événement n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour un événement
evenementRouter.put('/:id', auth, async (req, res) => {
  try {
    const evenementId = req.params.id;
    await Evenement.update(req.body, { where: { id: evenementId } });
    const updatedEvenement = await Evenement.findByPk(evenementId, {
      include: [{ model: TypeEvenement, as: 'typeEvenement' }],
    });
    if (!updatedEvenement) {
      const message = "L'événement demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `L'événement ${updatedEvenement.nom} a bien été modifié.`;
    res.json(success(message, updatedEvenement));
  } catch (error) {
    const message = "L'événement n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer un événement
evenementRouter.delete('/:id', auth, async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id);
    if (!evenement) {
      const message = "L'événement demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Evenement.destroy({ where: { id: evenement.id } });
    const message = `L'événement ${evenement.nom} a bien été supprimé.`;
    res.json(success(message, evenement));
  } catch (error) {
    const message = "L'événement n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { evenementRouter };
