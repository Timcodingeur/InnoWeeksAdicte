// Fichier : models/index.mjs
import { sequelize } from "../db/sequelize.mjs";
import { DataTypes } from "sequelize";
import { ClanModel } from "./clan.mjs";
import { RecompenseModel } from "./recompense.mjs";
import { UserModel } from "./user.mjs";
import { ObtenirModel } from "./obtenir.mjs";
import { OuvrirModel } from "./ouvrir.mjs";
import { TaskModel } from "./task.mjs";
import { LootboxModel } from "./lootbox.mjs";
import { ContenirModel } from "./contenir.mjs";
import { AttribuerModel } from "./attribuer.mjs";
import { ChatMessageModel } from './chat.mjs';

const Clan = ClanModel(sequelize, DataTypes);
const Recompense = RecompenseModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Obtenir = ObtenirModel(sequelize, DataTypes);
const Ouvrir = OuvrirModel(sequelize, DataTypes);
const Task = TaskModel(sequelize, DataTypes);
const Lootbox = LootboxModel(sequelize, DataTypes);
const Contenir = ContenirModel(sequelize, DataTypes);
const Attribuer = AttribuerModel(sequelize, DataTypes);
const ChatMessage = ChatMessageModel(sequelize, DataTypes);

// Définir ici toutes les associations
Clan.hasMany(User, { foreignKey: 'fkclan', as: 'users' });
User.belongsTo(Clan, { foreignKey: 'fkclan', as: 'clandetail' });

User.belongsToMany(Recompense, { through: "Obtenir" });
Recompense.belongsToMany(User, { through: "Obtenir" });

Recompense.belongsToMany(Lootbox, { through: Contenir, as: "lootboxes" });
Lootbox.belongsToMany(Recompense, { through: Contenir, as: "recompenses" });

Lootbox.belongsToMany(User, { through: "Ouvrir" });
User.belongsToMany(Lootbox, { through: "Ouvrir" });

User.hasMany(ChatMessage, { foreignKey: 'userId', as: 'messages' });
ChatMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });


Task.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

export {
  Clan,
  Recompense,
  User,
  Obtenir,
  Ouvrir,
  Task,
  Lootbox,
  Contenir,
  Attribuer,
  sequelize,
  ChatMessage,
};
