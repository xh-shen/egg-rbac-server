'use strict';
const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize;
  const Photos = app.model.define(
    'gas_photos',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cardNo: {
        type: STRING(40),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '员工身份证号必须填写',
          },
          isCardNo(value) {
            if (
              value !== '' &&
              !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
                value
              )
            ) {
              throw new Error('员工身份证号格式不正确');
            }
          },
        },
        comment: '员工身份证号',
      },

      photo: {
        type: STRING(400),
        allowNull: false,
        defaultValue: '',
        comment: '员工工作照',
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
      tableName: 'gas_photos',
    }
  );
  return Photos;
};
