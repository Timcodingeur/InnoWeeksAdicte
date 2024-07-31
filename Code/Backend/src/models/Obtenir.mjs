export const ObtenirModel = (sequelize, DataTypes) => {
  return sequelize.define("Obtenir", {
    idrecompense: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Recompenses",
        key: "id",
      },
    },
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });
};
