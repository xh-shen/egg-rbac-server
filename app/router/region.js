'use strict';

module.exports = app => {
  const { router, controller } = app;
  const checkApi = app.middleware.checkApi(app);
  router.get('/admin/v1/all/region', app.jwt, checkApi, controller.region.all);
};
