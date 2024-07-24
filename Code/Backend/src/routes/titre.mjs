import express from 'express';
import { Titre, User } from '../models/index.mjs';
import { success } from './helper.mjs';
import { auth } from '../auth/auth.mjs';

const titreRouter = express.Router();

// Route pour récupérer tous les titres
titreRouter.get('/', auth, async (req, res) => {
  try {
    const titres = await Titre.findAll();
    const message = 'La liste des titres a bien été récupérée.';
    res.json(success(message, titres));
  } catch (error) {
    const message = "La liste des titres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer un titre par ID
titreRouter.get('/:id', auth, async (req, res) => {
  try {
    const titre = await Titre.findByPk(req.params.id);
    if (!titre) {
      const message = "Le titre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le titre dont l'id vaut ${titre.id} a bien été récupéré.`;
    res.json(success(message, titre));
  } catch (error) {
    const message = "Le titre n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer un nouveau titre
titreRouter.post('/', auth, async (req, res) => {
  try {
    const createdTitre = await Titre.create(req.body);
    const message = `Le titre ${createdTitre.nom} a bien été créé !`;
    res.json(success(message, createdTitre));
  } catch (error) {
    const message = "Le titre n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour un titre
titreRouter.put('/:id', auth, async (req, res) => {
  try {
    const titreId = req.params.id;
    await Titre.update(req.body, { where: { id: titreId } });
    const updatedTitre = await Titre.findByPk(titreId);
    if (!updatedTitre) {
      const message = "Le titre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le titre ${updatedTitre.nom} a bien été modifié.`;
    res.json(success(message, updatedTitre));
  } catch (error) {
    const message = "Le titre n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer un titre
titreRouter.delete('/:id', auth, async (req, res) => {
  try {
    const titre = await Titre.findByPk(req.params.id);
    if (!titre) {
      const message = "Le titre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await Titre.destroy({ where: { id: titre.id } });
    const message = `Le titre ${titre.nom} a bien été supprimé.`;
    res.json(success(message, titre));
  } catch (error) {
    const message = "Le titre n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { titreRouter };
