'use strict';

module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const Permission = app.model.define(
    'gas_permission',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: STRING,
        validate: {
          isIn: {
            args: [[ 'menu', 'element', 'api' ]],
            msg: '权限类型错误',
          },
        },
        comment: '权限类型',
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      tableName: 'gas_permission',
      timestamps: false,
    }
  );
  Permission.associate = function() {
    app.model.Permission.hasOne(app.model.Menu, {
      as: 'menu',
      foreignKey: 'gasPermissionId',
    });
    app.model.Permission.hasOne(app.model.Element, {
      as: 'element',
      foreignKey: 'gasPermissionId',
    });
    app.model.Permission.hasOne(app.model.Api, {
      as: 'api',
      foreignKey: 'gasPermissionId',
    });
    app.model.Permission.belongsToMany(app.model.Role, {
      through: app.model.RolePermission,
      as: 'roles',
      constraints: false,
      foreignKey: 'gasPermissionId',
      otherKey: 'gasRoleId',
    });
  };
  return Permission;
};
