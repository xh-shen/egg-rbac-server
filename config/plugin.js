'use strict';

/** @type Egg.EggPlugin */
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.bcrypt = {
  enable: true,
  package: 'egg-bcrypt',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

// exports.assets = {
//   enable: true,
//   package: 'egg-view-assets',
// };
