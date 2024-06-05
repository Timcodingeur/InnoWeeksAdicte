// Fichier : models/index.mjs
import { sequelize } from "../db/sequelize.mjs";
import { DataTypes } from "sequelize";
import { ClanModel } from "./clan.mjs";
import { RecompenseModel } from "./recompense.mjs";
import { UserModel } from "./user.mjs";

const Clan = ClanModel(sequelize, DataTypes);
const Recompense = RecompenseModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

// Définir ici toutes les associations
User.belongsTo(Clan, { foreignkey: "clanId", as: "clandetail" });
/*Book.belongsTo(Author, { foreignKey: "authorId", as: "authorDetails" });
Book.belongsTo(Editor, { foreignKey: "editorId", as: "editorDetails" });
Book.belongsTo(Category, { foreignKey: "categoryId", as: "categoryDetails" });*/
// Ajouter d'autres associations si nécessaire

export { Clan, Recompense, User, sequelize };
