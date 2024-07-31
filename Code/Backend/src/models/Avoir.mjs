export const AvoirModel = (sequelize, DataTypes) => {
  return sequelize.define("Avoir", {
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    idtitre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Titres",
        key: "id",
      },
    },
  });
};
