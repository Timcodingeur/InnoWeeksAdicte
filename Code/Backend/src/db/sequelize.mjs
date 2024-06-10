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
import { attribuer } from "./mock-attribuer.mjs"; // Ajout du mock attribuer

const sequelize = new Sequelize("db_adictive", "root", "root", {
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
Clan.hasMany(User, { foreignKey: 'fkclan', as: 'users' });
User.belongsTo(Clan, { foreignKey: "fkclan", as: "clandetail" });

User.belongsToMany(Recompense, { through: Obtenir, foreignKey: 'idUser', otherKey: 'idRecompense' });
Recompense.belongsToMany(User, { through: Obtenir, foreignKey: 'idRecompense', otherKey: 'idUser' });

Recompense.belongsToMany(Lootbox, { through: Contenir, foreignKey: 'idRecompense', otherKey: 'idLootbox' });
Lootbox.belongsToMany(Recompense, { through: Contenir, foreignKey: 'idLootbox', otherKey: 'idRecompense' });

Lootbox.belongsToMany(User, { through: Ouvrir, foreignKey: 'idLootbox', otherKey: 'idUser' });
User.belongsToMany(Lootbox, { through: Ouvrir, foreignKey: 'idUser', otherKey: 'idLootbox' });

Task.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

const initDb = () => {
  return sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
    .then(() => sequelize.sync({ force: true }))
    .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true }))
    .then(async (_) => {
      await importData();
      console.log("La base de données db_adictive a bien été synchronisée");
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
  await importAttribuer(); // Ajout de l'importation attribuer
};

const importClans = async () => {
  for (const clan of clans) {
    await Clan.create({
      nom: clan.nom,
      description: clan.description,
      level: clan.level
    });
  }
};

const importUsers = async () => {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    await User.create({
      username: user.username,
      password: hash,
      email: user.email,
      point: user.point,
      level: user.level,
      photo: user.photo,
      isadmin: user.isadmin,
      fkclan: user.fkclan,
      name: user.name,
      familyname: user.familyname
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
      assignedUserId: task.assignedUserId || null, // Peut être null
      status: task.status || 'encours', // Par défaut à 'encours'
    });
  }
};

const importContenir = async () => {
  for (const entry of contenir) {
    await Contenir.create({
      idLootbox: entry.idLootbox,
      idRecompense: entry.idRecompense,
      LootboxId: entry.idLootbox,
      RecompenseId: entry.idRecompense,
    });
  }
};

const importObtenir = async () => {
  for (const entry of obtenir) {
    if (!entry.idUser || !entry.idRecompense) {
      console.error('Invalid data in mock-obtenir:', entry);
      continue;
    }
    await Obtenir.create({
      idUser: entry.idUser,
      idRecompense: entry.idRecompense,
      UserId: entry.idUser,
      RecompenseId: entry.idRecompense,
    });
  }
};

const importOuvrir = async () => {
  for (const entry of ouvrir) {
    if (!entry.idUser || !entry.idLootbox) {
      console.error('Invalid data in mock-ouvrir:', entry);
      continue;
    }
    await Ouvrir.create({
      idUser: entry.idUser,
      idLootbox: entry.idLootbox,
      UserId: entry.idUser,
      LootboxId: entry.idLootbox,
    });
  }
};

const importAttribuer = async () => {
  for (const entry of attribuer) {
    if (!entry.idUser || !entry.idTask) {
      console.error('Invalid data in mock-attribuer:', entry);
      continue;
    }
    await Attribuer.create({
      idUser: entry.idUser,
      idTask: entry.idTask,
      UserId: entry.idUser,
      TaskId: entry.idTask,
    });
  }
};

export { sequelize, initDb, Attribuer, Clan, Contenir, Lootbox, Obtenir, Ouvrir, Recompense, Task, User };
