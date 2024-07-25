export const AttribuerModel = (sequelize, DataTypes) => {
  return sequelize.define("Attribuer", {
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
