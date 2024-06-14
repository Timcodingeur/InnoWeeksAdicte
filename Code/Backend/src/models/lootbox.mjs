export const LootboxModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Lootboxs",
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
      prix: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image:{
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      timestamps: true,
      createdAt: "created",
      updateAt: false,
    }
  );
};
