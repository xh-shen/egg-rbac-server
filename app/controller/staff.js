'use strict';

const Controller = require('egg').Controller;

class StaffController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = await service.staff.index(ctx.query);
    ctx.helper.success(data);
  }

  async show() {
    const { ctx, service } = this;
    const data = await service.staff.show(ctx.params.id);
    ctx.helper.success(data);
  }

  async create() {
    const { ctx, service } = this;
    const data = await service.staff.create(ctx.request.body);
    ctx.helper.success(data, '创建成功', 201);
  }

  async update() {
    const { ctx, service } = this;
    await service.staff.update(ctx.params.id, ctx.request.body);
    ctx.status = 204;
    // ctx.helper.success(user, '编辑成功', 201);
  }

  async destroy() {
    const { ctx, service } = this;
    await service.staff.destroy(ctx.params.id);
    ctx.helper.success(null, '删除成功', 200);
  }

  async export() {
    const { ctx, service } = this;
    const data = await service.staff.export(ctx.query);
    ctx.helper.success(data, '导出成功', 200);
  }
}

module.exports = StaffController;
