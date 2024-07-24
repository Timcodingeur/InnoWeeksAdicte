export const EvenementModel = (sequelize, DataTypes) => {
    return sequelize.define('Evenement', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idTypeEvenement: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      timestamps: false,
    });
  };
  