export const PossederModel = (sequelize, DataTypes) => {
  return sequelize.define("Posseder", {
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    idpoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Points",
        key: "id",
      },
    },
    nbpoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
