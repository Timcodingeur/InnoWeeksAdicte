export const BooksModel = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Ce titre est déjà pris.",
        },
        validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          notEmpty: {
            msg: "Le titre ne peut pas être vide.",
          },
          notNull: {
            msg: "Le titre est une propriété obligatoire",
          },
        },
      },
      category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nmbPage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resume: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          notEmpty: {
            msg: "Le resume ne peut pas être vide.",
          },
          notNull: {
            msg: "Le resume est une propriété obligatoire",
          },
        },
      },
      author: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nmbPage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      editor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        /*validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          notEmpty: {
            msg: "L'image ne peut pas être vide",
          },
          notNull: {
            msg: "l'image est une propriété obligatoire",
          },
        },*/
      },
      extrait: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "L'extrait'ne peut pas être vide.",
          },
          notNull: {
            msg: "L'extrait est une propriété obligatoire",
          },
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );

  Book.associate = (models) => {
    Book.hasMany(models.Note, { foreignKey: "book" });
    Book.hasMany(models.Comment, { foreignKey: "book" });

    Book.belongsTo(models.Author, {
      foreignKey: "author",
      as: "author",
    });

    // Associating Book with Editor
    Book.belongsTo(models.Editor, {
      foreignKey: "editor",
      as: "editor",
    });

    // Associating Book with Category
    Book.belongsTo(models.Category, {
      foreignKey: "category",
      as: "category",
    });
  };
  return Book;
};
