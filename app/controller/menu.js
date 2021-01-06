'use strict';
const Controller = require('egg').Controller;

class MenuController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = await service.menu.index();
    ctx.helper.success(data);
  }

  async show() {
    const { ctx, service } = this;
    const data = await service.menu.show(ctx.params.id);
    ctx.helper.success(data);
  }

  async create() {
    const { ctx, service } = this;
    const data = await service.menu.create(ctx.request.body);
    ctx.helper.success(data, '创建成功', 201);
  }

  async update() {
    const { ctx, service } = this;
    await service.menu.update(ctx.params.id, ctx.request.body);
    ctx.status = 204;
  }

  // async destroy() {
  //   const { ctx, service } = this;
  //   const count = await service.menu.destroy(ctx.params.id);
  //   ctx.helper.success(count, '删除成功', 200);
  // }
}

module.exports = MenuController;
