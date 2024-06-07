export const RecompenseModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Recompense",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          notEmpty: {
            msg: "Le nom ne peut pas être vide.",
          },
          notNull: {
            msg: "Le nom est une propriété obligatoire",
          },
        },
      },
      image: {
        type: DataTypes.BLOB,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updateAt: false,
    }
  );
};
