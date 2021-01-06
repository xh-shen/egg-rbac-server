'use strict';
const moment = require('moment');

module.exports = app => {
  const { INTEGER, STRING, VIRTUAL, DATE } = app.Sequelize;
  const Element = app.model.define(
    'gas_element',
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
            msg: '元素名称必须填写',
          },
          len: {
            args: [ 2, 10 ],
            msg: '元素名称必须2-10位字符',
          },
        },
        comment: '元素名称',
      },
      code: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: '元素编码必须填写',
          },
          isCode(value) {
            if (!/^[a-z][a-z0-9A-Z-]+[a-z0-9A-Z]$/.test(value)) {
              throw new Error('元素编码只能英文开头，包含英文数字中划线');
            }
          },
          len: {
            args: [ 2, 40 ],
            msg: '元素编码长度在40个字符',
          },
        },
        comment: '元素编码',
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
      tableName: 'gas_element',
    }
  );
  Element.associate = function() {
    app.model.Element.belongsTo(app.model.Menu, {
      as: 'menu',
      foreignKey: 'gasMenuId',
      constraints: false,
    });
  };
  return Element;
};
