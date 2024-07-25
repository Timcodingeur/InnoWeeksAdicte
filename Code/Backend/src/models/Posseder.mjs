export const PossederModel = (sequelize, DataTypes) => {
  return sequelize.define("Posseder", {
    iduser: {
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
