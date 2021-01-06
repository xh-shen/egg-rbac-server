'use strict';

const Controller = require('egg').Controller;

// const formRule = {
//   username: { type: 'string', required: true },
//   email: { type: 'string', required: true },
// };

class UserController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = await service.user.index(ctx.query);
    ctx.helper.success(data);
  }

  async info() {
    const { ctx, service } = this;
    const data = await service.user.info();
    ctx.helper.success(data);
  }

  async show() {
    const { ctx, service } = this;
    const data = await service.user.show(ctx.params.id);
    ctx.helper.success(data);
  }

  async create() {
    const { ctx, service } = this;
    // ctx.validate(formRule);
    const data = await service.user.create(ctx.request.body);
    ctx.helper.success(data, '创建成功', 201);
  }

  async update() {
    const { ctx, service } = this;
    delete ctx.request.body.username;
    await service.user.update(ctx.params.id, ctx.request.body);
    ctx.status = 204;
    // ctx.helper.success(user, '编辑成功', 201);
  }

  async destroy() {
    const { ctx, service } = this;
    await service.user.destroy(ctx.params.id);
    ctx.helper.success(null, '删除成功', 200);
  }

  async destroyMult() {
    const { ctx, service } = this;
    await service.user.destroyMult(ctx.request.body.ids);
    ctx.helper.success(null, '删除成功', 200);
  }

  async resetPwd() {
    const { ctx, service } = this;
    await service.user.resetPwd(ctx.params.id);
    ctx.helper.success(null, '重置密码成功', 200);
  }

  async editPassword() {
    const { ctx, service } = this;
    await service.user.editPassword(ctx.request.body);
    ctx.helper.success(null, '修改成功', 200);
  }

  async editInfo() {
    const { ctx, service } = this;
    await service.user.editInfo(ctx.request.body);
    ctx.helper.success(null, '修改成功', 200);
  }

  async all() {
    const { ctx, service } = this;
    const data = await service.user.all();
    ctx.helper.success(data, '获取成功', 200);
  }
}

module.exports = UserController;
