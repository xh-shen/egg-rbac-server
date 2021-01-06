'use strict';
const moment = require('moment');

module.exports = app => {
  const { INTEGER, STRING, VIRTUAL, DATE, BOOLEAN } = app.Sequelize;
  const Menu = app.model.define(
    'gas_menu',
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
            msg: '菜单名称必须填写',
          },
          len: {
            args: [ 2, 10 ],
            msg: '菜单名称必须2-10位字符',
          },
        },
        comment: '菜单名称',
      },
      code: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: '菜单编码必须填写',
          },
          isCode(value) {
            if (!/^[a-z][a-z0-9A-Z-]+[a-z0-9A-Z]$/.test(value)) {
              throw new Error('菜单编码只能英文开头，包含英文数字中划线');
            }
          },
          len: {
            args: [ 2, 20 ],
            msg: '菜单限编码长度在2到20个字符',
          },
        },
        comment: '菜单编码',
      },
      pid: {
        type: INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: '父级菜单id',
      },
      path: {
        type: STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: '路径必须填写',
          },
        },
        comment: '路径',
      },
      cmpPath: {
        type: STRING,
        defaultValue: '',
        comment: '组件路径',
      },
      sort: {
        type: INTEGER,
        defaultValue: 1,
        validate: {
          isInt: {
            msg: '排序必须是有效的正整数',
          },
        },
        comment: '排序',
      },
      icon: {
        type: STRING,
        defaultValue: '',
        comment: '图标',
      },
      activeMenu: {
        type: STRING,
        defaultValue: '',
        comment: '高亮',
      },
      hidden: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '隐藏菜单',
      },
      isRouter: {
        type: INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[ 0, 1 ]],
            msg: '路由不合法',
          },
        },
        comment: '路由',
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
      isSuper: {
        type: INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[ 0, 1 ]],
            msg: '超级值不合法',
          },
        },
        comment: '是否是超级',
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
      tableName: 'gas_menu',
    }
  );
  Menu.associate = function() {
    app.model.Menu.hasMany(app.model.Element, {
      as: 'elements',
      foreignKey: 'gasMenuId',
    });
    app.model.Menu.hasMany(app.model.Api, {
      as: 'apis',
      foreignKey: 'gasMenuId',
    });
  };
  return Menu;
};
