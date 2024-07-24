import express from 'express';
import { BattlePass, User } from '../models/index.mjs';
import { success } from './helper.mjs';
import { auth } from '../auth/auth.mjs';

const battlePassRouter = express.Router();

// Route pour récupérer tous les battle passes
battlePassRouter.get('/', auth, async (req, res) => {
  try {
    const battlePasses = await BattlePass.findAll();
    const message = 'La liste des battle passes a bien été récupérée.';
    res.json(success(message, battlePasses));
  } catch (error) {
    const message = "La liste des battle passes n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour récupérer un battle pass par ID
battlePassRouter.get('/:id', auth, async (req, res) => {
  try {
    const battlePass = await BattlePass.findByPk(req.params.id);
    if (!battlePass) {
      const message = "Le battle pass demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le battle pass dont l'id vaut ${battlePass.id} a bien été récupéré.`;
    res.json(success(message, battlePass));
  } catch (error) {
    const message = "Le battle pass n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour créer un nouveau battle pass
battlePassRouter.post('/', auth, async (req, res) => {
  try {
    const createdBattlePass = await BattlePass.create(req.body);
    const message = `Le battle pass ${createdBattlePass.nom} a bien été créé !`;
    res.json(success(message, createdBattlePass));
  } catch (error) {
    const message = "Le battle pass n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour mettre à jour un battle pass
battlePassRouter.put('/:id', auth, async (req, res) => {
  try {
    const battlePassId = req.params.id;
    await BattlePass.update(req.body, { where: { id: battlePassId } });
    const updatedBattlePass = await BattlePass.findByPk(battlePassId);
    if (!updatedBattlePass) {
      const message = "Le battle pass demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `Le battle pass ${updatedBattlePass.nom} a bien été modifié.`;
    res.json(success(message, updatedBattlePass));
  } catch (error) {
    const message = "Le battle pass n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour supprimer un battle pass
battlePassRouter.delete('/:id', auth, async (req, res) => {
  try {
    const battlePass = await BattlePass.findByPk(req.params.id);
    if (!battlePass) {
      const message = "Le battle pass demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    await BattlePass.destroy({ where: { id: battlePass.id } });
    const message = `Le battle pass ${battlePass.nom} a bien été supprimé.`;
    res.json(success(message, battlePass));
  } catch (error) {
    const message = "Le battle pass n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { battlePassRouter };
