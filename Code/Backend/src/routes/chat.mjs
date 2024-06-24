import express from 'express';
import { ChatMessage, User } from '../models/index.mjs';
import { success } from './helper.mjs';
import { auth } from '../auth/auth.mjs';

const chatRouter = express.Router();

// Route pour récupérer les messages de chat
chatRouter.get('/', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({
      include: [{ model: User, as: 'user', attributes: ['username'] }],
      order: [['created', 'ASC']],
    });
    const message = 'La liste des messages a bien été récupérée.';
    res.json(success(message, messages));
  } catch (error) {
    const message = "La liste des messages n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

// Route pour envoyer un message de chat
chatRouter.post("/", auth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId; // Assuming userId is stored in the request object by the auth middleware

    const newMessage = await ChatMessage.create({
      userId,
      message,
    });

    const successMessage = "Message envoyé avec succès.";
    res.json(success(successMessage, newMessage));
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const message = "Le message n'a pas pu être envoyé. Merci de vérifier les informations fournies.";
      return res.status(400).json({ message, data: error });
    }
    const message = "Le message n'a pas pu être envoyé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

export { chatRouter };
