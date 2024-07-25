export const AvoirModel = (sequelize, DataTypes) => {
  return sequelize.define("Avoir", {
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idtitre: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
