export const UserModel = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[^?!]+$/,
          msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
        },
        notEmpty: {
          msg: "Le prenom ne peut pas être vide.",
        },
        notNull: {
          msg: "Le prenom est une propriété obligatoire",
        },
      },
    },
    familyname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[^?!]+$/,
          msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
        },
        notEmpty: {
          msg: "Le nom de famille ne peut pas être vide.",
        },
        notNull: {
          msg: "Le nom de famille est une propriété obligatoire",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      is: {
        args: /^[^?!]+$/,
        msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
      },
      unique: {
        msg: "Ce username est déjà pris.",
      },
      notEmpty: {
        msg: "Le prénom ne peut pas être vide.",
      },
      notNull: {
        msg: "Le prénom est une propriété obligatoire",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: {
        msg: "Le prénom ne peut pas être vide.",
      },
      notNull: {
        msg: "Le prénom est une propriété obligatoire",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trophee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photo: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    isadmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    fkClan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Clans",
        key: "id",
      },
    },
    fkLigue: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Ligues",
        key: "id",
      },
    },
    fkRecompenseChoisi: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Recompenses",
        key: "id",
      },
    },
  });
};
