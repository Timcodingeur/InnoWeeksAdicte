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
User.belongsTo(Clan, { foreignkey: "clanId", as: "clandetail" });
User.belongsToMany(Recompense, { through: "Obtenir" });
Recompense.belongsToMany(User, { through: "Obtenir" });
Recompense.belongsToMany(Lootbox, { through: "Contenir" });
Lootbox.belongsToMany(Recompense, { through: "Contenir" });
Lootbox.belongsToMany(User, { through: "Ouvrir" });
User.belongsToMany(Lootbox, { through: "Ouvrir" });
Task.belongsToMany(User, { through: "Attribuer" });
User.belongsToMany(Task, { through: "Attribuer" });
/*Book.belongsTo(Author, { foreignKey: "authorId", as: "authorDetails" });
Book.belongsTo(Editor, { foreignKey: "editorId", as: "editorDetails" });
Book.belongsTo(Category, { foreignKey: "categoryId", as: "categoryDetails" });*/
// Ajouter d'autres associations si nécessaire

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
