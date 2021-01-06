'use strict';

module.exports = app => {
  const { router, controller } = app;
  // 登陆
  router.post('/admin/v1/signin', controller.auth.signin);
  // 登出
  router.post('/admin/v1/signout', app.jwt, controller.auth.signout);
  // 获取验证码
  router.get('/admin/v1/captcha', controller.auth.captcha);
};
