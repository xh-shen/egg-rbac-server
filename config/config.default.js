/*
 * @Author: shen
 * @Date: 2019-11-19 15:06:04
 * @LastEditors: shen
 * @LastEditTime: 2021-01-06 09:47:27
 * @Description:
 */
/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1568159084261_2792';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'decrypt' ];

  config.adminHost = 'http://localhost:8080';

  config.expireIn = 2 * 60 * 60 * 1000;

  config.secret = 'ViQmKzCqtGoZwvqf4wRzfh26WBbR36YmwuLKkJGmT55';

  config.initPwd = '111';
  // 数据库
  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    dialectOptions: {
      charset: 'utf8mb4',
    },
    database: 'rbac',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: 'root',
    underscored: true,
    timezone: '+08:00',
  };
  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };

  // config.multipart = {
  //   mode: 'file',
  // };

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://127.0.0.1:8080' ],
  };

  config.jwt = {
    secret: 'gIFu8ANlaMaWuw1x48fg3cEmKdyhFfop',
    enable: true, // default is false
    match: '/jwt', // optional
  };

  config.bcrypt = {
    saltRounds: 10, // default 10
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 1,
    },
  };
  //  华为obs，有就用，没有就删除
  config.obsClient = {
    access_key_id: 'id',
    secret_access_key: 'key',
    server: 'https://ip:port',
    bucket: 'rbac',
    key: 'local',
    url: '/rabc/local',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
