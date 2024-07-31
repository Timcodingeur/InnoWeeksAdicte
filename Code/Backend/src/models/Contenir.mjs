export const ContenirModel = (sequelize, DataTypes) => {
  return sequelize.define("Contenir", {
    idrecompense: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Recompenses",
        key: "id",
      },
    },
    idlootbox: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Lootboxes",
        key: "id",
      },
    },
  });
};
