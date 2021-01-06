'use strict';
const moment = require('moment');

module.exports = app => {
  const { INTEGER, STRING, VIRTUAL, DATE } = app.Sequelize;
  const Api = app.model.define(
    'gas_api',
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
            msg: '接口名称必须填写',
          },
          len: {
            args: [ 2, 10 ],
            msg: '接口名称必须2-10位字符',
          },
        },
        comment: '接口名称',
      },
      path: {
        type: STRING,
        validate: {
          notEmpty: {
            msg: '接口路径必须填写',
          },
          isPath(value) {
            if (!/^(\/{1})[a-z0-9A-Z-\/:\*]+$/.test(value)) {
              throw new Error('接口路径只能“/”开头，包含英文数字中划线”/“');
            } else if (value.length > 60) {
              throw new Error('接口路径最多60个字符');
            }
          },
        },
        comment: '接口路径',
      },
      method: {
        type: STRING,
        validate: {
          notEmpty: {
            msg: '接口方法必须填写',
          },
          isIn: {
            args: [
              [
                'GET',
                'POST',
                'PUT',
                'DELETE',
                'HEAD',
                'PATCH',
                'get',
                'post',
                'put',
                'delete',
                'head',
                'patch',
              ],
            ],
            msg: '接口方法错误',
          },
        },
        set(val) {
          this.setDataValue('method', val.toUpperCase());
        },
        comment: '接口方法',
      },
      description: {
        type: STRING,
        defaultValue: '',
        validate: {
          max: {
            args: 30,
            msg: '描述最多30个字符',
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
      tableName: 'gas_api',
    }
  );
  Api.associate = function() {
    app.model.Api.belongsTo(app.model.Menu, {
      as: 'menu',
      foreignKey: 'gasMenuId',
      constraints: false,
    });
  };
  return Api;
};
