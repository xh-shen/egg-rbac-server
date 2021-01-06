'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, STRING, VIRTUAL, DATE } = app.Sequelize;
  const Region = app.model.define(
    'gas_region',
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
            msg: '地区名称必须填写',
          },
          len: {
            args: [ 2, 30 ],
            msg: '地区名称长度在2到30个字符',
          },
        },
        comment: '地区名称',
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
      tableName: 'gas_region',
    }
  );
  // 定义关联关系
  Region.associate = () => {
    app.model.Region.hasMany(app.model.User, {
      as: 'users',
      foreignKey: 'gasRegionId',
    });
    app.model.Region.hasMany(app.model.Company, {
      as: 'companys',
      foreignKey: 'gasRegionId',
    });
    app.model.Region.hasMany(app.model.Staff, {
      as: 'staffs',
      foreignKey: 'gasRegionId',
    });
  };
  return Region;
};
