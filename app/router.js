'use strict';
const path = require('path');
const fs = require('fs');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  const controllerPath = path.join(process.cwd(), '/app', '/router');
  const files = fs.readdirSync(controllerPath);
  files.forEach(route => {
    require(`./router/${route}`)(app);
  });
};
