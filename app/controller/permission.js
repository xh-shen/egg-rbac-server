'use strict';

const Controller = require('egg').Controller;

class PermissionController extends Controller {
  async index() {
    const { ctx, app } = this;
    const data = JSON.parse(await app.redis.get('gas_permissions'));
    ctx.helper.success(data);
  }

  async show() {
    const { ctx, service } = this;
    const data = await service.permission.show(ctx.params.id);
    ctx.helper.success(data);
  }

  async create() {
    const { ctx, service } = this;
    // ctx.validate(formRule);
    const data = await service.permission.create(ctx.request.body);
    ctx.helper.success(data, '创建成功', 201);
  }

  async update() {
    const { ctx, service } = this;
    await service.permission.update(ctx.params.id, ctx.request.body);
    ctx.status = 204;
    // ctx.helper.success(user, '编辑成功', 201);
  }
}

module.exports = PermissionController;
