'use strict';

module.exports = app => {
  const { router, controller } = app;
  const checkApi = app.middleware.checkApi(app);
  router.resources('/admin/v1/element', app.jwt, checkApi, controller.element);
};
