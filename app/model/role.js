'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, STRING, VIRTUAL, DATE } = app.Sequelize;
  const Role = app.model.define(
    'gas_role',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '角色名称必须填写',
          },
          len: {
            args: [ 2, 20 ],
            msg: '角色名称长度在2到20个字符',
          },
        },
        comment: '角色名称',
      },
      description: {
        type: STRING,
        defaultValue: '',
        validate: {
          max: {
            args: 30,
            msg: '角色描述最多30个字符',
          },
        },
        comment: '描述',
      },
      status: {
        type: INTEGER,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[ 0, 1 ]],
            msg: '状态值不合法',
          },
        },
        comment: '状态',
      },
      statusName: {
        type: VIRTUAL,
        get() {
          return this.status ? '启用' : '停用';
        },
      },
      createdAt: {
        type: DATE,
        comment: '创建时间',
        get() {
          return moment(this.getDataValue('createdAt')).format(
            'YYYY-MM-DD HH:mm:ss'
          );
        },
      },
      updatedAt: {
        type: DATE,
        comment: '修改时间',
        get() {
          return moment(this.getDataValue('updatedAt')).format(
            'YYYY-MM-DD HH:mm:ss'
          );
        },
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      tableName: 'gas_role',
    }
  );
  // 定义关联关系
  Role.associate = () => {
    app.model.Role.belongsToMany(app.model.User, {
      through: app.model.UserRole,
      as: 'users',
      constraints: false,
      foreignKey: 'gasRoleId',
      otherKey: 'gasUserId',
    });
    app.model.Role.belongsToMany(app.model.Permission, {
      through: app.model.RolePermission,
      as: 'permissions',
      constraints: false,
      foreignKey: 'gasRoleId',
      otherKey: 'gasPermissionId',
    });
  };
  return Role;
};
