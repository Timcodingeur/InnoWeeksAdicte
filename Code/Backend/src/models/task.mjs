// TaskModel
export const TaskModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          notEmpty: {
            msg: "Le nom ne peut pas être vide.",
          },
          notNull: {
            msg: "Le nom est une propriété obligatoire",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          notEmpty: {
            msg: "Le nom ne peut pas être vide.",
          },
          notNull: {
            msg: "Le nom est une propriété obligatoire",
          },
        },
      },
      nbpoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["encours", "fini"],
        defaultValue: "encours",
        allowNull: false,
      },
      fkEvenement: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Evenements",
          key: "id",
        },
      },
      fkBattlePass: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "BattlePasses",
          key: "id",
        },
      },
      fkPoint: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Points",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updateAt: false,
    }
  );
};
