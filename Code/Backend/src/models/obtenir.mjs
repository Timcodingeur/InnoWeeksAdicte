export const ObtenirModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Obtenir",
    {
      idUser: {
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
