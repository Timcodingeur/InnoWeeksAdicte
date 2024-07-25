export const ObtenirModel = (sequelize, DataTypes) => {
  return sequelize.define("Obtenir", {
    idrecompense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
