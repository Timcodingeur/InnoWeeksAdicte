export const DemanderModel = (sequelize, DataTypes) => {
  return sequelize.define("Demander", {
    idlootbox: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idpoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nbpoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
