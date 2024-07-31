export const MettreModel = (sequelize, DataTypes) => {
  return sequelize.define("Mettre", {
    idrecompense: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Recompenses",
        key: "id",
      },
    },
    idbattlepass: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "BattlePasses",
        key: "id",
      },
    },
  });
};
