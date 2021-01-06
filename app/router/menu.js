'use strict';

module.exports = app => {
  const { router, controller } = app;
  const checkApi = app.middleware.checkApi(app);
  router.resources('/admin/v1/menu', app.jwt, checkApi, controller.menu);
};
