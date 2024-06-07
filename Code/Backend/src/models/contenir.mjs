export const ContenirModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Contenir",
    {
      idLootbox: {
        type: DataTypes.INTEGER,
      },
      idRecompense: {
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
