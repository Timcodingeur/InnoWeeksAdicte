export const ContenirModel = (sequelize, DataTypes) => {
  return sequelize.define("Contenir", {
    idLootbox: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idRecompense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    LootboxId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RecompenseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    freezeTableName: true

  });
};
