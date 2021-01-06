'use strict';

module.exports = app => {
  const { router, controller } = app;
  const checkApi = app.middleware.checkApi(app);
  router.get('/admin/v1/role/:id/permission/get', app.jwt, checkApi, controller.role.getPermission);
  router.post('/admin/v1/role/:id/permission/set', app.jwt, checkApi, controller.role.setPermission);
  router.post('/admin/v1/role/:id/user/set', app.jwt, checkApi, controller.role.setUser);
  router.get('/admin/v1/all/role', app.jwt, checkApi, controller.role.all);
  router.resources('/admin/v1/role', app.jwt, checkApi, controller.role);
};
