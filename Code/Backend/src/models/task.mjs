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
      assignedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['encours', 'fini'],
        defaultValue: 'encours',
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updateAt: false,
    }
  );
};
