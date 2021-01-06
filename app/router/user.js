'use strict';

module.exports = app => {
  const { router, controller } = app;
  const checkApi = app.middleware.checkApi(app);
  router.post(
    '/admin/v1/user/info/edit',
    app.jwt,
    checkApi,
    controller.user.editInfo
  );
  router.post(
    '/admin/v1/user/password/edit',
    app.jwt,
    checkApi,
    controller.user.editPassword
  );
  router.get('/admin/v1/user/info', app.jwt, checkApi, controller.user.info);
  router.get('/admin/v1/all/user', app.jwt, checkApi, controller.user.all);
  router.post(
    '/admin/v1/mult/user/destroy',
    app.jwt,
    checkApi,
    controller.user.destroyMult
  );
  router.get(
    '/admin/v1/user/:id/reset',
    app.jwt,
    checkApi,
    controller.user.resetPwd
  );
  router.resources('/admin/v1/user', app.jwt, checkApi, controller.user);
};
