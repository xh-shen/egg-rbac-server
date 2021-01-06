'use strict';
const bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, STRING, VIRTUAL } = app.Sequelize;
  const User = app.model.define(
    'gas_user',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: STRING(20),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '用户名必须填写',
          },
          isAlphanumeric: {
            msg: '用户名只能包含数字和英文',
          },
          len: {
            args: [ 4, 20 ],
            msg: '用户名长度在4到20个字符',
          },
        },
        comment: '登录账号',
      },
      password: {
        type: STRING(100),
        allowNull: false,
        comment: '密码',
        set(val) {
          const salt = bcrypt.genSaltSync(10);
          const psw = bcrypt.hashSync(val, salt);
          this.setDataValue('password', psw);
        },
      },

      name: {
        type: STRING(200),
        defaultValue: '',
        comment: '单位名称',
        validate: {
          required(value) {
            if ((this.type === 1 || this.type === 2) && value === '') {
              throw new Error('单位名称必须填写');
            }
          },
          lenValid(value) {
            if (value !== '' && (value.length < 2 || value.length > 100)) {
              throw new Error('单位名称在2到100个字符');
            }
          },
        },
      },
      phone: {
        type: STRING(30),
        defaultValue: '',
        comment: '手机号',
        validate: {
          isPhone(value) {
            if (
              value !== '' &&
              !/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
                value
              )
            ) {
              throw new Error('手机号格式不正确');
            }
          },
        },
      },
      isInitPwd: {
        type: INTEGER,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[ 0, 1 ]],
            msg: '是否是初始化值密码不合法',
          },
        },
        comment: '是否是初始化密码',
      },
      isSuper: {
        type: INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[ 0, 1 ]],
            msg: '超级管理员值不合法',
          },
        },
        comment: '是否是超级管理员',
      },
      type: {
        type: INTEGER,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[ 1, 2, 3 ]],
            msg: '用户类型不合法',
          },
        },
        comment: '用户类型：1省级管理员2市级管理员3公司管理员',
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
      tableName: 'gas_user',
    }
  );
  User.associate = () => {
    app.model.User.belongsToMany(app.model.Role, {
      through: app.model.UserRole,
      as: 'roles',
      constraints: false,
      foreignKey: 'gasUserId',
      otherKey: 'gasRoleId',
    });
    app.model.User.belongsTo(app.model.Region, {
      as: 'region',
      foreignKey: 'gasRegionId',
      constraints: false,
    });
    app.model.User.belongsTo(app.model.Company, {
      as: 'company',
      foreignKey: 'gasCompanyId',
      constraints: false,
    });
  };
  return User;
};
