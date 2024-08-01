export const EvenementModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Evenement",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fkTypeEvenement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TypeEvenements",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
    }
  );
};
