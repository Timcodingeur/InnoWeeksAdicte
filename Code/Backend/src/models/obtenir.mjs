export const ObtenirModel = (sequelize, DataTypes) => {
  return sequelize.define("Obtenir", {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idRecompense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
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
