// Importez les modules requis et configurez l'authentification
import express from "express";
import { Book, Author, Editor, Category, Comment } from "../models/index.mjs";
import { sucess } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
import multer from "multer";
import accentFold from "accent-fold";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const booksRouter = express();

// Route GET /books
/**
 * @swagger
 * /api/books/:
 *  get:
 *    tags: [Books]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve all books.
 *    description: Retrieve all books. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: All books
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The book ID.
 *                      example: 1
 *                    title:
 *                      type: string
 *                      description: The book's title.
 *                      example: OnePiece n°1
 *                    extrait:
 *                      type: string
 *                      description: A extract of the book.
 *                      example: Je deviendrais le rois des pirate
 *                    year:
 *                      type: date
 *                      format: date-time
 *                      description: The book's creation date.
 *                      example: null
 *                    editor:
 *                      type: integer
 *                      description: The book's editor ID.
 *                      example: 2
 *                    category:
 *                      type: integer
 *                      description: The book's category ID.
 *                      example: 1
 *                    image:
 *                      type: string
 *                      description: The book's image url.
 *                      example: https://github.com/Timcodingeur/Projet-JS/blob/main/Image/Image-Books/OnePiece1.jpg
 *                    resume:
 *                      type: string
 *                      description: The book's resume
 *                      example: Luffy, un garçon espiègle, rêve de devenir le roi des pirates en trouvant le “One Piece”, un fabuleux trésor. Seulement, Luffy a avalé un fruit du démon qui l'a transformé en homme élastique.
 */
booksRouter.get("/", auth, async (req, res) => {
  try {
    const {
      title,
      categoryName,
      nmbPage,
      nomAuteur,
      prenomAuteur,
      nomEditeur,
      anneeEdition,
    } = req.query;

    let queryConditions = {};
    let include = [];
    // Critères de recherche avancée
    if (title && title.length >= 2) {
      queryConditions.title = {
        [Op.like]: `%${accentFold(title)}%`,
      };
    }

    if (nmbPage) {
      queryConditions.nmbPage = nmbPage;
    }

    if (anneeEdition) {
      queryConditions.year = anneeEdition;
    }

    // Limite de résultats
    let limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;
    let Books = await Book.findAll({
      where: queryConditions,
      include: include,
      order: ["title"],
      limit: limit,
    });

    // Récupération des détails des livres
    const detailedBooks = await Promise.all(
      Books.map(async (book) => {
        const [author, editor, category, comments] = await Promise.all([
          Author.findByPk(book.author + 1),
          Editor.findByPk(book.editor),
          Category.findByPk(book.category),
          Comment.findAll({
            where: { book: book.id },
            attributes: ["id", "comment", "note"],
          }),
        ]);
        if (
          nomAuteur &&
          (!author ||
            !accentFold(author.lastname)
              .toLowerCase()
              .includes(accentFold(nomAuteur).toLowerCase()))
        )
          return null;
        if (
          categoryName &&
          (!category ||
            !accentFold(category.name)
              .toLowerCase()
              .includes(accentFold(categoryName).toLowerCase()))
        )
          return null;

        if (
          prenomAuteur &&
          (!author ||
            !accentFold(author.firstname)
              .toLowerCase()
              .includes(accentFold(prenomAuteur).toLowerCase()))
        )
          return null;

        if (
          nomEditeur &&
          (!editor ||
            !accentFold(editor.nameEdit)
              .toLowerCase()
              .includes(accentFold(nomEditeur).toLowerCase()))
        )
          return null;
        return {
          id: book.id,
          title: book.title,
          extrait: book.extrait,
          resume: book.resume,
          year: book.year,
          nmbPage: book.nmbPage,
          author: author
            ? {
                id: author.id,
                firstname: author.firstname,
                lastname: author.lastname,
                created: author.created,
                updatedAt: author.updatedAt,
              }
            : null, // Gestion de la valeur null
          editor: editor
            ? {
                id: editor.id,
                nameEdit: editor.nameEdit,
                created: editor.created,
                updatedAt: editor.updatedAt,
              }
            : null, // Gestion de la valeur null
          category: category
            ? {
                id: category.id,
                name: category.name,
                created: category.created,
                updatedAt: category.updatedAt,
              }
            : null, // Gestion de la valeur null
          image: book.image,
          created: book.created,
          comments: comments,
        };
      })
    );

    const message = `Informations complètes sur les livres récupérées avec succès.`;
    res.json({ message, books: detailedBooks });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur", error: error.toString() });
  }
});

//
//route vers comments
booksRouter.get("/:id/comment", auth, async (req, res) => {
  const bookId = req.params.id;
  Book.findByPk(bookId).then((book) => {
    if (book === null) {
      const message =
        "Le livre demandé n'a pas pu être récupéré. Merci d'essayer un autre identifiant.";
      return res.status(404).json({ message });
    }
    Comment.findAll({
      where: { book: { [Op.eq]: book.id } },
    })
      .then((comments) => {
        const message = `commentaire du livre : ${book.name}`;
        res.json({ message, book: book, comment: comments });
      })
      .catch((error) => {
        const message =
          "Les commentaire du livre demandé n'ont pas pu être récupéré. Merci de réessayer dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
});
/**
 * @swagger
 * /api/books/:id:
 *  get:
 *    tags: [Books]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve one book.
 *    description: Retrieve one book. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: One book
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The book ID.
 *                      example: 1
 *                    title:
 *                      type: string
 *                      description: The book's title.
 *                      example: OnePiece n°1
 *                    extrait:
 *                      type: string
 *                      description: A extract of the book.
 *                      example: Je deviendrais le rois des pirate
 *                    year:
 *                      type: date
 *                      format: date-time
 *                      description: The book's creation date.
 *                      example: null
 *                    editor:
 *                      type: integer
 *                      description: The book's editor ID.
 *                      example: 2
 *                    category:
 *                      type: integer
 *                      description: The book's category ID.
 *                      example: 1
 *                    image:
 *                      type: string
 *                      description: The book's image url.
 *                      example: https://github.com/Timcodingeur/Projet-JS/blob/main/Image/Image-Books/OnePiece1.jpg
 *                    resume:
 *                      type: string
 *                      description: The book's resume
 *                      example: Luffy, un garçon espiègle, rêve de devenir le roi des pirates en trouvant le “One Piece”, un fabuleux trésor. Seulement, Luffy a avalé un fruit du démon qui l'a transformé en homme élastique.
 */

booksRouter.get("/:id", auth, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);

    if (book === null) {
      return res.status(404).json({
        message:
          "Le livre demandé n'existe pas. Merci d'essayer un autre identifiant.",
      });
    }

    // Récupérer l'auteur, l'éditeur et la catégorie en parallèle
    const [author, editor, category, comments] = await Promise.all([
      Author.findByPk(book.author),
      Editor.findByPk(book.editor),
      Category.findByPk(book.category),
      Comment.findAll({
        where: { book: bookId },
        attributes: ["id", "comment", "note"], // Sélection limitée aux ID des commentaires et aux notes
      }),
    ]);

    // Créer une nouvelle structure pour le livre incluant les informations de l'auteur, éditeur, et catégorie
    const detailedBook = {
      id: book.id,
      title: book.title,
      extrait: book.extrait,
      resume: book.resume,
      year: book.year,
      author: {
        id: author.id,
        firstname: author.firstname,
        lastname: author.lastname,
        created: author.created,
        updatedAt: author.updatedAt,
      },
      editor: {
        id: editor.id,
        nameEdit: editor.nameEdit,
        created: editor.created,
        updatedAt: editor.updatedAt,
      },
      category: {
        id: category.id,
        name: category.name,
        created: category.created,
        updatedAt: category.updatedAt,
      },
      image: book.image,
      created: book.created,
      comments: comments, // Ajout des commentaires avec juste l'ID et la note
    };

    const message =
      "Informations complètes sur le livre récupérées avec succès.";
    res.json({ message, book: detailedBook });
  } catch (error) {
    console.error("Error while fetching book:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Erreur serveur",
        error: error.toString(),
      });
    }
  }
});

booksRouter.get("/:id/category", auth, async (req, res) => {
  const bookId = req.params.id;
  Book.findByPk(bookId).then((book) => {
    if (book === null) {
      const message =
        "Le livre demandé n'existe pas. Merci d'essayer un autre identifiant.";
      return res.status(404).json({ message });
    }
    Category.findByPk(book.category)
      .then((category) => {
        const message = `La categorie du livre : ${category.name}`;
        res.json({ message, book: book, category: category });
      })
      .catch((error) => {
        const message =
          "Le livre de la category demandé n'a pas pu être récupéré. Merci de ressayer dans quelques instant.";
        res.status(500).json({ message, data: error });
      });
  });
});

booksRouter.get("/:id/author", auth, async (req, res) => {
  const bookId = req.params.id;
  Book.findByPk(bookId).then((book) => {
    Author.findByPk(book.author).then((author) => {
      const message = `L'auteur du livre : ${author.firstname} ${author.lastname}`;
      res.json({ message, book: book, author: author });
    });
  });
});

booksRouter.post("/", auth, upload.single("image"), (req, res) => {
  console.log(req.body);
  Book.create(req.body)
    .then((createdBook) => {
      console.log(createdBook);
      const message = `Le livre ${createdBook.title} a bien été crée !`;
      res.json(sucess(message, createdBook));
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "Le livre n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

booksRouter.put("/:id", auth, (req, res) => {
  const BookId = req.params.id;
  Book.update(req.body, { where: { id: BookId } })
    .then((_) => {
      return Book.findByPk(BookId).then((updateBook) => {
        if (updateBook === null) {
          const message =
            "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        const message = `Le livre ${updateBook.title} a bien été modifié`;
        res.json(sucess(message, updateBook));
      });
    })
    .catch((error) => {
      const message =
        "Le livre n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

booksRouter.delete("/:id", auth, (req, res) => {
  Book.findByPk(req.params.id)
    .then((deleteBook) => {
      if (deleteBook == null) {
        const message =
          "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant";
        return res.status(404).json({ message });
      }
      return Book.destroy({
        where: { id: deleteBook.id },
      }).then((_) => {
        const message = `Le livre ${deleteBook.title} a bien été supprimé`;
        res.json(sucess(message, deleteBook));
      });
    })
    .catch((error) => {
      const message =
        "Le livre n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { booksRouter };
