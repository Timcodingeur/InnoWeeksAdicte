export const MettreModel = (sequelize, DataTypes) => {
  return sequelize.define("Mettre", {
    idrecompense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idbattlepass: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
