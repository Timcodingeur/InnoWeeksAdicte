import { Sequelize, DataTypes } from "sequelize";

// Import des modèles simplifiés
import { ClanModel } from "./clan.mjs";
import { LootboxModel } from "./lootbox.mjs";
import { RecompenseModel } from "./recompense.mjs";
import { TaskModel } from "./task.mjs";
import { UserModel } from "./user.mjs";
import { ChatMessageModel } from './chat.mjs';

const sequelize = new Sequelize("db_adictive", "root", "root", {
  host: "localhost",
  port: 6033,
  dialect: "mysql",
  logging: false,  // Désactiver les logs SQL pour la clarté
});

// Initialisation des modèles
const Clan = ClanModel(sequelize, DataTypes);
const Lootbox = LootboxModel(sequelize, DataTypes);
const Recompense = RecompenseModel(sequelize, DataTypes);
const Task = TaskModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const ChatMessage = ChatMessageModel(sequelize, DataTypes);

Clan.hasMany(User, { foreignKey: 'fkclan', as: 'users' });
User.belongsTo(Clan, { foreignKey: 'fkclan', as: 'clandetail' });

User.belongsToMany(Recompense, { through: "Obtenir" });
Recompense.belongsToMany(User, { through: "Obtenir" });

Recompense.belongsToMany(Lootbox, { through: "Contenir", as: "lootboxes" });
Lootbox.belongsToMany(Recompense, { through: "Contenir", as: "recompenses" });

Lootbox.belongsToMany(User, { through: "Ouvrir" });
User.belongsToMany(Lootbox, { through: "Ouvrir" });

User.hasMany(ChatMessage, { foreignKey: 'userId', as: 'messages' });
ChatMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });


Task.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

export {
  sequelize,
  Clan,
  Lootbox,
  Recompense,
  Task,
  User,
  ChatMessage
};

