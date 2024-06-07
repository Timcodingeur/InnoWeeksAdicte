export const OuvrirModel = (sequelize, DataTypes) => {
  return sequelize.define("Ouvrir", {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idLootbox: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    LootboxId: {
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
