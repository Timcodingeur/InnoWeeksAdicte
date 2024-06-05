// Fichier : models/index.mjs
import { sequelize } from "../db/sequelize.mjs";
import { DataTypes } from "sequelize";
import { AuthorModel } from "./author.mjs";
import { BooksModel } from "./books.mjs";
import { CategoryModel } from "./category.mjs";
import { EditorModel } from "./editor.mjs";
import { CommentModel } from "./comment.mjs";
import { UserModel } from "./user.mjs";

const Author = AuthorModel(sequelize, DataTypes);
const Book = BooksModel(sequelize, DataTypes);
const Editor = EditorModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

// Définir ici toutes les associations
Book.belongsTo(Author, { foreignKey: "authorId", as: "authorDetails" });
Book.belongsTo(Editor, { foreignKey: "editorId", as: "editorDetails" });
Book.belongsTo(Category, { foreignKey: "categoryId", as: "categoryDetails" });
// Ajouter d'autres associations si nécessaire

export { Author, Book, Editor, Comment, Category, User, sequelize };
