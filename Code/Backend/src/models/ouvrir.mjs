export const OuvrirModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Ouvrir",
    {
      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      idLootbox: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Lootboxes",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: "updated",
      freezeTableName: true,
    }
  );
};
