import { Sequelize, DataTypes } from "sequelize";

//import des models

import { AuthorModel } from "../models/author.mjs";
import { BooksModel } from "../models/books.mjs";
import { CategoryModel } from "../models/category.mjs";
import { CommentModel } from "../models/comment.mjs";
import { EditorModel } from "../models/editor.mjs";
import { UserModel } from "../models/user.mjs";

//import des mocks
import { editors } from "./mock-editor.mjs";
import { comments } from "./mock-comments.mjs";
import { users } from "./mock-users.mjs";
import { books } from "./mock-books.mjs";
import { authors } from "./mock-author.mjs";
import { categorys } from "./mock-category.mjs";

import bcrypt from "bcrypt";

const sequelize = new Sequelize("db_ouvrage", "root", "root", {
  host: "localhost",
  port: "6033",
  dialect: "mysql",
  logging: false,
});

const Author = AuthorModel(sequelize, DataTypes);
const Book = BooksModel(sequelize, DataTypes);
const Editor = EditorModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

let initDb = () => {
  return sequelize.sync({ force: true }).then((_) => {
    importAuthor();
    importBooks();
    importCategorys();
    importComments();
    importEditors();

    importUsers();
    console.log("La base de données db_ouvrage a bien été synchronisée");
  });
};

const importAuthor = () => {
  authors.map((author) => {
    Author.create({
      lastname: author.lastname,
      firstname: author.firstname,
    }).then((author) => console.log(author.toJSON()));
  });
};

const importUsers = () => {
  users.map((user) => {
    bcrypt.hash(user.password, 10).then((hash) => {
      User.create({
        username: user.username,
        password: hash,
        firstname: user.firstname,
        lastname: user.lastname,
      }).then((user) => console.log(user.toJSON()));
    });
  });
};

const importBooks = () => {
  books.map((book) => {
    Book.create({
      title: book.title,
      category: book.category,
      nmbPage: book.nmbPage,
      resume: book.resume,
      author: book.author,
      editor: book.editor,
      date_year: book.year,
      image: book.image,
      extrait: book.extrait,
    }).then((book) => console.log(book.toJSON()));
  });
};

const importCategorys = () => {
  categorys.map((category) => {
    Category.create({
      name: category.name,
      description: category.description,
    }).then((category) => console.log(category.toJSON()));
  });
};

const importComments = () => {
  comments.map((comment) => {
    Comment.create({
      comment: comment.comment,
      book: comment.book,
      user: comment.user,
      note: comment.note,
    }).then((comment) => console.log(comment.toJSON()));
  });
};

const importEditors = () => {
  editors.map((editor) => {
    Editor.create({
      nameEdit: editor.nameEdit,
    }).then((editor) => console.log(editor.toJSON()));
  });
};

export { sequelize, initDb, Author, User, Book, Editor, Comment, Category };
