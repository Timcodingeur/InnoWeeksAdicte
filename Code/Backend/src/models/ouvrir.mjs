export const OuvrirModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Ouvrir",
    {
      idUser: {
        type: DataTypes.INTEGER,
      },
      idLootbox: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updateAt: false,
    }
  );
};
