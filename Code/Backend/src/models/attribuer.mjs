export const AttribuerModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Attribuer",
    {
      idUser: {
        type: DataTypes.INTEGER,
      },
      idTask: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updateAt: false,
    }
  );
};
