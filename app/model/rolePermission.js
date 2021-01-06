'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const RolePermission = app.model.define(
    'gas_role_permission',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      gasRoleId: {
        type: INTEGER,
      },
      gasPermissionId: {
        type: INTEGER,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      tableName: 'gas_role_permission',
    }
  );
  return RolePermission;
};
