'use strict';
const Service = require('egg').Service;
const bcrypt = require('bcryptjs');
const svgCaptcha = require('svg-captcha');
const uuidv4 = require('uuid/v4');

class AuthService extends Service {
  async signin(body) {
    const { ctx, app } = this;
    const uuid = ctx.headers.uuid;

    let gasCaptcha = await app.redis.get('gas_captcha');
    gasCaptcha = gasCaptcha ? JSON.parse(gasCaptcha) : {};
    if (!gasCaptcha[uuid]) {
      ctx.throw(401, '验证码错误');
    } else {
      const { code } = gasCaptcha[uuid];
      delete gasCaptcha[uuid];
      await app.redis.set('gas_captcha', JSON.stringify(gasCaptcha));
      if (body.code !== code) {
        ctx.throw(401, '验证码错误');
      }
    }
    const user = await ctx.model.User.findOne({
      where: {
        username: body.username,
      },
    });
    if (!user) {
      ctx.throw(404, '用户名不存在');
    }
    if (user.status === 0) {
      ctx.throw(401, '用户已停用');
    }
    const correct = bcrypt.compareSync(body.password, user.password);
    if (!correct) {
      ctx.throw(401, '密码错误');
    }
    const roles = await user.getRoles({ raw: true, attributes: [ 'id' ] });
    const token = app.jwt.sign(
      {
        id: user.id,
        username: user.username,
        isSuper: user.isSuper,
        type: user.type,
        gasCompanyId: user.gasCompanyId,
        gasRegionId: user.gasRegionId,
        roleIds: roles.map(item => item.id),
      },
      this.config.jwt.secret
    );
    const timestamp = new Date().getTime();
    let auth = await app.redis.get('gas_auth');
    auth = auth ? JSON.parse(auth) : {};
    auth[user.username] = {
      token,
      timestamp: timestamp + this.config.expireIn,
    };
    await app.redis.set('gas_auth', JSON.stringify(auth));
    return {
      token,
    };
  }

  async signout() {
    const { ctx, app } = this;
    const { username } = ctx.state.user;
    let auth = await app.redis.get('gas_auth');
    auth = auth ? JSON.parse(auth) : {};
    auth[username] && delete auth[username];
    await app.redis.set('gas_auth', JSON.stringify(auth));
    return null;
  }

  async captcha() {
    const { ctx, app } = this;
    const prevUuid = ctx.headers.uuid;
    const captcha = svgCaptcha.createMathExpr({
      width: 120,
      height: 50,
      noise: 10,
      color: true,
    });
    const uuid = uuidv4();
    const timestamp = new Date().getTime();
    let gasCaptcha = await app.redis.get('gas_captcha');
    gasCaptcha = gasCaptcha ? JSON.parse(gasCaptcha) : {};
    gasCaptcha[prevUuid] && delete gasCaptcha[prevUuid];
    gasCaptcha[uuid] = {
      code: captcha.text,
      timestamp: timestamp + 10 * 60 * 1000,
    };
    const newCaptcha = {};
    for (const key in gasCaptcha) {
      if (gasCaptcha[key].timestamp > timestamp) {
        newCaptcha[key] = gasCaptcha[key];
      }
    }
    await app.redis.set('gas_captcha', JSON.stringify(newCaptcha));
    return {
      captcha: captcha.data,
      uuid,
    };
  }
}

module.exports = AuthService;
