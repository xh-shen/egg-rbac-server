'use strict';
const Controller = require('egg').Controller;

const loginRule = {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true }
};

class AuthController extends Controller {
  // 登陆
  async signin() {
    const { ctx, service } = this;
    ctx.validate(loginRule);
    // const errors = app.validator.validate(loginRule, ctx.request.body);
    const data = await service.auth.signin(ctx.request.body);
    ctx.helper.success(data, '登录成功');
  }

  // 登出
  async signout() {
    const { ctx, service } = this;
    const data = await service.auth.signout();
    ctx.helper.success(data, '登出成功');
  }

  async captcha() {
    const { ctx, service } = this;
    const data = await service.auth.captcha();
    ctx.helper.success(data, '获取成功');
  }
}

module.exports = AuthController;
