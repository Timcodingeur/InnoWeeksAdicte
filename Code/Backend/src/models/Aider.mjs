export const AiderModel = (sequelize, DataTypes) => {
  return sequelize.define("Aider", {
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idtask: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
