export const AttribuerModel = (sequelize, DataTypes) => {
  return sequelize.define("Attribuer", {
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
