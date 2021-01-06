'use strict';

module.exports = app => {
  const { router, controller } = app;
  const checkApi = app.middleware.checkApi(app);
  router.post(
    '/admin/v1/company/info/edit',
    app.jwt,
    checkApi,
    controller.company.editInfo
  );
  router.get(
    '/admin/v1/all/company',
    app.jwt,
    checkApi,
    controller.company.all
  );
  router.resources('/admin/v1/company', app.jwt, checkApi, controller.company);
};
