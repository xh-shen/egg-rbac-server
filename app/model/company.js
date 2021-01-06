'use strict';
const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, STRING, VIRTUAL } = app.Sequelize;
  const Company = app.model.define(
    'gas_company',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(200),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '公司名称必须填写',
          },
          len: {
            args: [ 2, 100 ],
            msg: '公司名称长度在2到100个字符',
          },
        },
        comment: '公司名称',
      },
      mobile: {
        type: STRING(30),
        defaultValue: '',
        comment: '公司电话',
        validate: {
          isPhone(value) {
            if (
              value !== '' &&
              !/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
                value
              )
            ) {
              throw new Error('公司电话格式不正确');
            }
          },
        },
      },
      contacts: {
        type: STRING(20),
        defaultValue: '',
        validate: {
          max: {
            args: 10,
            msg: '联系人长度最多10个字符',
          },
        },
        comment: '联系人',
      },
      contactsMobile: {
        type: STRING(30),
        defaultValue: '',
        comment: '联系人手机号',
        validate: {
          isPhone(value) {
            if (
              value !== '' &&
              !/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
                value
              )
            ) {
              throw new Error('联系人手机号格式不正确');
            }
          },
        },
      },
      email: {
        type: STRING(100),
        allowNull: false,
        defaultValue: '',
        validate: {
          isEmail(value) {
            if (
              value !== '' &&
              !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
                value
              )
            ) {
              throw new Error('公司邮箱格式不正确');
            }
          },
        },
        comment: '公司邮箱',
      },
      website: {
        type: STRING(100),
        allowNull: false,
        defaultValue: '',
        validate: {
          isUrl(value) {
            if (
              value !== '' &&
              !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
                value
              )
            ) {
              throw new Error('公司网址格式不正确');
            }
          },
        },
        comment: '公司网址',
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
      tableName: 'gas_company',
    }
  );
  Company.associate = () => {
    app.model.Company.hasMany(app.model.User, {
      as: 'users',
      foreignKey: 'gasCompanyId',
    });
    app.model.Company.hasMany(app.model.Staff, {
      as: 'staffs',
      foreignKey: 'gasCompanyId',
    });
    app.model.Company.belongsTo(app.model.Region, {
      as: 'region',
      foreignKey: 'gasRegionId',
      constraints: false,
    });
  };
  return Company;
};
