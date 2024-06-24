import jwt from "jsonwebtoken";
import { privateKey } from "./private_key.mjs";

const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en dans l'en-tête de la requête." });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Le format du token d'authentification est incorrect. Utilisez 'Bearer <token>'." });
  }

  jwt.verify(token, privateKey, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ message: "Le jeton fourni est invalide.", data: error });
    }

    if (!decodedToken || !decodedToken.userId) {
      return res.status(401).json({ message: "Le jeton ne contient pas les données nécessaires à l'authentification." });
    }

    // Configurez à la fois req.userId et req.user pour la compatibilité avec différentes parties de l'application
    req.userId = decodedToken.userId; // Pour compatibilité avec le code utilisant req.userId
    req.user = { id: decodedToken.userId }; // Pour compatibilité avec le code utilisant req.user.id
    console.log(`User ID from token: ${req.userId} (also accessible via req.user.id)`);

    next();
  });
};

export { auth };
