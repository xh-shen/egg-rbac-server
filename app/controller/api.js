'use strict';

const Controller = require('egg').Controller;

class ApiController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = await service.api.index(ctx.query);
    ctx.helper.success(data);
  }

  async show() {
    const { ctx, service } = this;
    const data = await service.api.show(ctx.params.id);
    ctx.helper.success(data);
  }

  async create() {
    const { ctx, service } = this;
    const data = await service.api.create(ctx.request.body);
    ctx.helper.success(data, '创建成功', 201);
  }

  async update() {
    const { ctx, service } = this;
    await service.api.update(ctx.params.id, ctx.request.body);
    ctx.status = 204;
    // ctx.helper.success(user, '编辑成功', 201);
  }
}

module.exports = ApiController;

