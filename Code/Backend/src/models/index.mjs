import { Sequelize, DataTypes } from "sequelize";

// Import des modèles simplifiés
import { TitreModel } from './titre.mjs';
import { TypeEvenementModel } from './typeEvenement.mjs';
import { EvenementModel } from './evenement.mjs';
import { PointModel } from './point.mjs';
import { BattlePassModel } from './battlePass.mjs';
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
const Titre = TitreModel(sequelize, DataTypes);
const TypeEvenement = TypeEvenementModel(sequelize, DataTypes);
const Evenement = EvenementModel(sequelize, DataTypes);
const Point = PointModel(sequelize, DataTypes);
const BattlePass = BattlePassModel(sequelize, DataTypes);

User.belongsToMany(Titre, { through: "Avoir" });
Titre.belongsToMany(User, { through: "Avoir" });

User.belongsToMany(Task, { through: "Attribuer" });
Task.belongsToMany(User, { through: "Attribuer" });

Task.belongsToMany(Point, { through: "Caracteriser" });
Point.belongsToMany(Task, { through: "Caracteriser" });

User.belongsToMany(Point, { through: "Posseder" });
Point.belongsToMany(User, { through: "Posseder" });

Evenement.belongsTo(TypeEvenement, { foreignKey: 'idTypeEvenement', as: 'typeEvenement' });
TypeEvenement.hasMany(Evenement, { foreignKey: 'idTypeEvenement', as: 'evenements' });

BattlePass.belongsToMany(User, { through: "Inclure" });
User.belongsToMany(BattlePass, { through: "Inclure" });

Task.belongsToMany(User, { through: "Aider" });
User.belongsToMany(Task, { through: "Aider" });

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
  ChatMessage,
  Titre,
  TypeEvenement,
  Evenement,
  Point,
  BattlePass
};

