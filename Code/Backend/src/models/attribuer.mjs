export const AttribuerModel = (sequelize, DataTypes) => {
  return sequelize.define("Attribuer", {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idTask: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TaskId: {
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
