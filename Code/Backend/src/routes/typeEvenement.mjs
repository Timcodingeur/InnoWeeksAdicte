import express from 'express';
import { TypeEvenement } from '../models/index.mjs';
import { success } from './helper.mjs';
import { auth } from '../auth/auth.mjs';

const typeEvenementRouter = express.Router();

// Route pour récupérer tous les types d'événements
typeEvenementRouter.get('/', auth, async (req, res) => {
  try {
    const typesEvenement = await TypeEvenement.findAll();
    const message = 'La liste des types d\'événements a bien été récupérée.';
    res.json(success(message, typesEvenement));
  } catch (error) {
    const message = "La liste des types d'événements n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer un type d'événement par ID
typeEvenementRouter.get('/:id', auth, async (req, res) => {
  try {
    const typeEvenement = await TypeEvenement.findByPk(req.params.id);
    if (!typeEvenement) {
      const message = "Le type d'événement demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le type d'événement dont l'id vaut ${typeEvenement.id} a bien été récupéré.`;
    res.json(success(message, typeEvenement));
  } catch (error) {
    const message = "Le type d'événement n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer un nouveau type d'événement
typeEvenementRouter.post('/', auth, async (req, res) => {
  try {
    const createdTypeEvenement = await TypeEvenement.create(req.body);
    const message = `Le type d'événement ${createdTypeEvenement.nom} a bien été créé !`;
    res.json(success(message, createdTypeEvenement));
  } catch (error) {
    const message = "Le type d'événement n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour un type d'événement
typeEvenementRouter.put('/:id', auth, async (req, res) => {
  try {
    const typeEvenementId = req.params.id;
    await TypeEvenement.update(req.body, { where: { id: typeEvenementId } });
    const updatedTypeEvenement = await TypeEvenement.findByPk(typeEvenementId);
    if (!updatedTypeEvenement) {
      const message = "Le type d'événement demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le type d'événement ${updatedTypeEvenement.nom} a bien été modifié.`;
    res.json(success(message, updatedTypeEvenement));
  } catch (error) {
    const message = "Le type d'événement n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer un type d'événement
typeEvenementRouter.delete('/:id', auth, async (req, res) => {
  try {
    const typeEvenement = await TypeEvenement.findByPk(req.params.id);
    if (!typeEvenement) {
      const message = "Le type d'événement demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await TypeEvenement.destroy({ where: { id: typeEvenement.id } });
    const message = `Le type d'événement ${typeEvenement.nom} a bien été supprimé.`;
    res.json(success(message, typeEvenement));
  } catch (error) {
    const message = "Le type d'événement n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { typeEvenementRouter };
