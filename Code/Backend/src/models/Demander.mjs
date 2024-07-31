export const DemanderModel = (sequelize, DataTypes) => {
  return sequelize.define("Demander", {
    idlootbox: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Lootboxes",
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
