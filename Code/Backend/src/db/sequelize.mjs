// Fichier : db/sequelize.mjs
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

// Import des modèles
import { AttribuerModel } from "../models/attribuer.mjs";
import { ClanModel } from "../models/clan.mjs";
import { ContenirModel } from "../models/contenir.mjs";
import { LootboxModel } from "../models/lootbox.mjs";
import { ObtenirModel } from "../models/obtenir.mjs";
import { OuvrirModel } from "../models/ouvrir.mjs";
import { RecompenseModel } from "../models/recompense.mjs";
import { TaskModel } from "../models/task.mjs";
import { UserModel } from "../models/user.mjs";

// Import des mocks
import { clans } from "./mock-clans.mjs";
import { contenir } from "./mock-contenir.mjs";
import { lootboxs } from "./mock-lootboxs.mjs";
import { obtenir } from "./mock-obtenir.mjs";
import { ouvrir } from "./mock-ouvrir.mjs";
import { recompenses } from "./mock-recompenses.mjs";
import { tasks } from "./mock-task.mjs";
import { users } from "./mock-users.mjs";

const sequelize = new Sequelize("db_ouvrage", "root", "root", {
  host: "localhost",
  port: 6033,
  dialect: "mysql",
  logging: false,
});

const Attribuer = AttribuerModel(sequelize, DataTypes);
const Clan = ClanModel(sequelize, DataTypes);
const Contenir = ContenirModel(sequelize, DataTypes);
const Lootbox = LootboxModel(sequelize, DataTypes);
const Obtenir = ObtenirModel(sequelize, DataTypes);
const Ouvrir = OuvrirModel(sequelize, DataTypes);
const Recompense = RecompenseModel(sequelize, DataTypes);
const Task = TaskModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

// Définir les associations
User.belongsTo(Clan, { foreignKey: "clanId", as: "clandetail" });
User.belongsToMany(Recompense, { through: Obtenir });
Recompense.belongsToMany(User, { through: Obtenir });
Recompense.belongsToMany(Lootbox, { through: Contenir });
Lootbox.belongsToMany(Recompense, { through: Contenir });
Lootbox.belongsToMany(User, { through: Ouvrir });
User.belongsToMany(Lootbox, { through: Ouvrir });
Task.belongsToMany(User, { through: Attribuer });
User.belongsToMany(Task, { through: Attribuer });

const initDb = () => {
  return sequelize.sync({ force: true }).then(async (_) => {
    await importData();
    console.log("La base de données db_ouvrage a bien été synchronisée");
  });
};

const importData = async () => {
  await importClans();
  await importUsers();
  await importRecompenses();
  await importLootboxs();
  await importTasks();
  await importContenir();
  await importObtenir();
  await importOuvrir();
};

const importClans = async () => {
  for (const clan of clans) {
    await Clan.create({
      nom: clan.nom,
    });
  }
};

const importUsers = async () => {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    await User.create({
      username: user.username,
      password: hash,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      point: user.point,
      level: user.level,
      photo: user.photo,
      isadmin: user.isadmin,
      fkclan: user.fkclan,
    });
  }
};

const importRecompenses = async () => {
  for (const recompense of recompenses) {
    await Recompense.create({
      nom: recompense.nom,
      image: recompense.image,
    });
  }
};

const importLootboxs = async () => {
  for (const lootbox of lootboxs) {
    await Lootbox.create({
      nom: lootbox.nom,
      prix: lootbox.prix,
    });
  }
};

const importTasks = async () => {
  for (const task of tasks) {
    await Task.create({
      nom: task.nom,
      description: task.description,
      nbpoints: task.nbpoints,
    });
  }
};

const importContenir = async () => {
  for (const entry of contenir) {
    await Contenir.create({
      idLootbox: entry.idLootbox,
      idRecompense: entry.idRecompense,
    });
  }
};

const importObtenir = async () => {
  for (const entry of obtenir) {
    await Obtenir.create({
      idUser: entry.idUser,
      idRecompense: entry.idRecompense,
    });
  }
};

const importOuvrir = async () => {
  for (const entry of ouvrir) {
    await Ouvrir.create({
      idUser: entry.idUser,
      idLootbox: entry.idLootbox,
    });
  }
};

export { sequelize, initDb, Attribuer, Clan, Contenir, Lootbox, Obtenir, Ouvrir, Recompense, Task, User };
