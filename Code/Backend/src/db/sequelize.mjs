import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

// Import des modèles
import { ClanModel } from "../models/clan.mjs";
import { LootboxModel } from "../models/lootbox.mjs";
import { RecompenseModel } from "../models/recompense.mjs";
import { TaskModel } from "../models/task.mjs";
import { UserModel } from "../models/user.mjs";
import { ChatMessageModel } from "../models/chat.mjs"; // Ajout du modèle ChatMessage

// Import des mocks
import { clans } from "./mock-clans.mjs";
import { lootboxs } from "./mock-lootboxs.mjs";
import { recompenses } from "./mock-recompenses.mjs";
import { tasks } from "./mock-task.mjs";
import { users } from "./mock-users.mjs";
import { chatMessages } from "./mock-chat.mjs"; // Ajout du mock chatMessages

const sequelize = new Sequelize("db_adictive", "root", "root", {
  host: "localhost",
  port: 6033,
  dialect: "mysql",
  logging: false,
});

const Clan = ClanModel(sequelize, DataTypes);
const Lootbox = LootboxModel(sequelize, DataTypes);
const Recompense = RecompenseModel(sequelize, DataTypes);
const Task = TaskModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const ChatMessage = ChatMessageModel(sequelize, DataTypes); // Définir le modèle ChatMessage

// Définir les associations


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
  await importChatMessages(); 
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
      trophee: user.trophee,
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
      image: lootbox.image,
    });
  }
};

const importTasks = async () => {
  for (const task of tasks) {
    await Task.create({
      nom: task.nom,
      description: task.description,
      nbpoints: task.nbpoints,
      assignedUserId: task.assignedUserId || null, 
      status: task.status || 'encours', 
    });
  }
};




const importChatMessages = async () => {
  for (const entry of chatMessages) {
    if (!entry.userId || !entry.message) {
      console.error('Invalid data in mock-chat:', entry);
      continue;
    }
    await ChatMessage.create({
      userId: entry.userId,
      message: entry.message,
    });
  }
};

export { sequelize, initDb, Clan, Lootbox, Recompense, Task, User, ChatMessage };

