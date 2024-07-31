export const AiderModel = (sequelize, DataTypes) => {
  return sequelize.define("Aider", {
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    idtask: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tasks",
        key: "id",
      },
    },
  });
};
