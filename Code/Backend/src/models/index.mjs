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

const Clan = ClanModel(sequelize, DataTypes);
const Recompense = RecompenseModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Obtenir = ObtenirModel(sequelize, DataTypes);
const Ouvrir = OuvrirModel(sequelize, DataTypes);
const Task = TaskModel(sequelize, DataTypes);
const Lootbox = LootboxModel(sequelize, DataTypes);
const Contenir = ContenirModel(sequelize, DataTypes);
const Attribuer = AttribuerModel(sequelize, DataTypes);

// Définir ici toutes les associations
Clan.hasMany(User, { foreignKey: 'fkclan', as: 'users' });
User.belongsTo(Clan, { foreignkey: "fkclan", as: "clandetail" });

User.belongsToMany(Recompense, { through: "Obtenir" });
Recompense.belongsToMany(User, { through: "Obtenir" });

Recompense.belongsToMany(Lootbox, { through: "Contenir" });
Lootbox.belongsToMany(Recompense, { through: "Contenir" });

Lootbox.belongsToMany(User, { through: "Ouvrir" });
User.belongsToMany(Lootbox, { through: "Ouvrir" });

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
};
