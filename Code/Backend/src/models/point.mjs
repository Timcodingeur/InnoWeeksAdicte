export const PointModel = (sequelize, DataTypes) => {
    return sequelize.define('Point', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      typeDePoint: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      courteDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      timestamps: false,
    });
  };
  