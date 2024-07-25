import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

// Import des modèles
import { ClanModel } from "../models/clan.mjs";
import { LootboxModel } from "../models/lootbox.mjs";
import { RecompenseModel } from "../models/recompense.mjs";
import { TaskModel } from "../models/task.mjs";
import { UserModel } from "../models/user.mjs";
import { ChatMessageModel } from "../models/chat.mjs";
import { TitreModel } from "../models/titre.mjs";
import { TypeEvenementModel } from "../models/typeEvenement.mjs";
import { EvenementModel } from "../models/evenement.mjs";
import { PointModel } from "../models/point.mjs";
import { BattlePassModel } from "../models/battlePass.mjs";
import { ObtenirModel } from "../models/Obtenir.mjs";
import { ContenirModel } from "../models/Contenir.mjs";
import { MettreModel } from "../models/Mettre.mjs";
import { DemanderModel } from "../models/Demander.mjs";
import { PossederModel } from "../models/Posseder.mjs";
import { AvoirModel } from "../models/Avoir.mjs";
import { AiderModel } from "../models/Aider.mjs";
import { AttribuerModel } from "../models/Attribuer.mjs";

// Import des mocks
import { clans } from "./mock-clans.mjs";
import { lootboxs } from "./mock-lootboxs.mjs";
import { recompenses } from "./mock-recompenses.mjs";
import { tasks } from "./mock-task.mjs";
import { users } from "./mock-users.mjs";
import { chatMessages } from "./mock-chat.mjs";
import { titres } from "./mock-titres.mjs";
import { typesEvenement } from "./mock-typesEvenement.mjs";
import { evenements } from "./mock-evenements.mjs";
import { points } from "./mock-points.mjs";
import { battlePasses } from "./mock-battlePasses.mjs";
import { obtenir } from "./mock-obtenir.mjs";
import { contenir } from "./mock-contenir.mjs";
import { mettre } from "./mock-mettre.mjs";
import { demander } from "./mock-demander.mjs";
import { posseder } from "./mock-posseder.mjs";
import { avoir } from "./mock-avoir.mjs";
import { aider } from "./mock-aider.mjs";
import { attribuer } from "./mock-attribuer.mjs";

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
const ChatMessage = ChatMessageModel(sequelize, DataTypes);
const Titre = TitreModel(sequelize, DataTypes);
const TypeEvenement = TypeEvenementModel(sequelize, DataTypes);
const Evenement = EvenementModel(sequelize, DataTypes);
const Point = PointModel(sequelize, DataTypes);
const BattlePass = BattlePassModel(sequelize, DataTypes);
const Obtenir = ObtenirModel(sequelize, DataTypes);
const Contenir = ContenirModel(sequelize, DataTypes);
const Mettre = MettreModel(sequelize, DataTypes);
const Demander = DemanderModel(sequelize, DataTypes);
const Posseder = PossederModel(sequelize, DataTypes);
const Avoir = AvoirModel(sequelize, DataTypes);
const Aider = AiderModel(sequelize, DataTypes);
const Attribuer = AttribuerModel(sequelize, DataTypes);

const initDb = () => {
  return sequelize
    .query("SET FOREIGN_KEY_CHECKS = 0", { raw: true })
    .then(() => sequelize.sync({ force: true }))
    .then(() => sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true }))
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
  await importTitres();
  await importTypesEvenement();
  await importEvenements();
  await importPoints();
  await importBattlePasses();
  await importObtenir();
  await importContenir();
  await importMettre();
  await importDemander();
  await importPosseder();
  await importAvoir();
  await importAider();
  await importAttribuer();
};

const importClans = async () => {
  for (const clan of clans) {
    await Clan.create({
      nom: clan.nom,
      description: clan.description,
      level: clan.level,
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
      familyname: user.familyname,
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
      status: task.status || "encours",
    });
  }
};

const importChatMessages = async () => {
  for (const entry of chatMessages) {
    if (!entry.userId || !entry.message) {
      console.error("Invalid data in mock-chat:", entry);
      continue;
    }
    await ChatMessage.create({
      userId: entry.userId,
      message: entry.message,
    });
  }
};

const importTitres = async () => {
  for (const titre of titres) {
    await Titre.create({
      nom: titre.nom,
      obtention: titre.obtention,
    });
  }
};

const importTypesEvenement = async () => {
  for (const typeEvenement of typesEvenement) {
    await TypeEvenement.create({
      description: typeEvenement.description,
      nom: typeEvenement.nom,
    });
  }
};

const importEvenements = async () => {
  for (const evenement of evenements) {
    await Evenement.create({
      nom: evenement.nom,
      idTypeEvenement: evenement.idTypeEvenement,
    });
  }
};

const importPoints = async () => {
  for (const point of points) {
    await Point.create({
      typeDePoint: point.typeDePoint,
      courteDescription: point.courteDescription,
    });
  }
};

const importBattlePasses = async () => {
  for (const battlePass of battlePasses) {
    await BattlePass.create({
      nom: battlePass.nom,
      description: battlePass.description,
    });
  }
};

const importObtenir = async () => {
  for (const obten of obtenir) {
    await Obtenir.create({
      iduser: obten.iduser,
      idrecompense: obten.idrecompense,
    });
  }
};

const importContenir = async () => {
  for (const conten of contenir) {
    await Contenir.create({
      idlootbox: conten.idlootbox,
      idrecompense: conten.idrecompense,
    });
  }
};

const importMettre = async () => {
  for (const mettres of mettre) {
    await Mettre.create({
      idbattlepass: mettres.idbattlepass,
      idrecompense: mettres.idrecompense,
    });
  }
};

const importDemander = async () => {
  for (const deman of demander) {
    await Demander.create({
      idlootbox: deman.idlootbox,
      idpoint: deman.idpoint,
      nbpoints: deman.nbpoints,
    });
  }
};

const importPosseder = async () => {
  for (const possed of posseder) {
    await Posseder.create({
      iduser: possed.iduser,
      idpoint: possed.idpoint,
      nbpoints: possed.nbpoints,
    });
  }
};

const importAvoir = async () => {
  for (const av of avoir) {
    await Avoir.create({
      iduser: av.iduser,
      idtitre: av.idtitre,
    });
  }
};

const importAider = async () => {
  for (const aid of aider) {
    await Aider.create({
      iduser: aid.iduser,
      idtask: aid.idtask,
    });
  }
};

const importAttribuer = async () => {
  for (const attribu of attribuer) {
    await Attribuer.create({
      iduser: attribu.iduser,
      idtask: attribu.idtask,
    });
  }
};

export {
  sequelize,
  initDb,
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
  BattlePass,
};
