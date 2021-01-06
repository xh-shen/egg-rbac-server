'use strict';

module.exports = app => {
  const { router, controller } = app;
  const checkApi = app.middleware.checkApi(app);
  router.get(
    '/admin/v1/export/staff',
    app.jwt,
    checkApi,
    controller.staff.export
  );
  router.resources('/admin/v1/staff', app.jwt, checkApi, controller.staff);
};
