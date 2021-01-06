'use strict';
const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, STRING, VIRTUAL } = app.Sequelize;
  const Staff = app.model.define(
    'gas_staff',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '员工姓名必须填写',
          },
          len: {
            args: [ 2, 10 ],
            msg: '员工姓名长度在2到10个字符',
          },
        },
        comment: '员工姓名',
      },

      mobile: {
        type: STRING(30),
        allowNull: false,
        comment: '员工手机号',
        validate: {
          notEmpty: {
            msg: '员工手机号必须填写',
          },
          isPhone(value) {
            if (
              value !== '' &&
              !/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
                value
              )
            ) {
              throw new Error('员工手机号格式不正确');
            }
          },
        },
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
      jobNumber: {
        type: STRING(40),
        allowNull: false,
        defaultValue: '',
        comment: '员工工号',
      },
      job: {
        type: STRING(40),
        allowNull: false,
        defaultValue: '',
        comment: '员工职务',
      },
      jurisdiction: {
        type: STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '员工负责辖区',
      },
      photo: {
        type: STRING(400),
        allowNull: false,
        defaultValue: '',
        comment: '员工工作照',
      },
      sex: {
        type: INTEGER,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[ 1, 2 ]],
            msg: '性别不合法',
          },
        },
        comment: '员工性别',
      },
      sexName: {
        type: VIRTUAL,
        get() {
          return this.sex === 1 ? '男' : '女';
        },
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
      tableName: 'gas_staff',
    }
  );
  Staff.associate = () => {
    app.model.Staff.belongsTo(app.model.Company, {
      as: 'company',
      foreignKey: 'gasCompanyId',
      constraints: false,
    });
    app.model.Staff.belongsTo(app.model.Region, {
      as: 'region',
      foreignKey: 'gasRegionId',
      constraints: false,
    });
    app.model.Staff.belongsTo(app.model.Photos, {
      as: 'photos',
      foreignKey: 'cardNo',
      targetKey: 'cardNo',
      constraints: false,
    });
  };
  return Staff;
};
