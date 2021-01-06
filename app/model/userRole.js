'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const UserRole = app.model.define(
    'gas_user_role',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      gasUserId: {
        type: INTEGER,
      },
      gasRoleId: {
        type: INTEGER,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      tableName: 'gas_user_role',
    }
  );
  return UserRole;
};
