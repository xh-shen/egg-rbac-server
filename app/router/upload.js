'use strict';

module.exports = app => {
  const { router, controller } = app;
  const checkApi = app.middleware.checkApi(app);
  router.post(
    '/admin/v1/upload/picture',
    app.jwt,
    checkApi,
    controller.upload.picture
  );

  router.post(
    '/admin/v1/upload/multiple',
    app.jwt,
    checkApi,
    controller.upload.multiple
  );

  router.post(
    '/admin/v1/upload/excel/import/company',
    app.jwt,
    checkApi,
    controller.upload.importCompany
  );

  // router.post(
  //   '/admin/v1/upload/excel/import/staff',
  //   app.jwt,
  //   checkApi,
  //   controller.upload.importStaff
  // );
};
