export const ContenirModel = (sequelize, DataTypes) => {
  return sequelize.define("Contenir", {
    idrecompense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idlootbox: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
