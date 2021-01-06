'use strict';

const Controller = require('egg').Controller;

class CompanyController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = await service.company.index(ctx.query);
    ctx.helper.success(data);
  }

  async show() {
    const { ctx, service } = this;
    const data = await service.company.show(ctx.params.id);
    ctx.helper.success(data);
  }

  async create() {
    const { ctx, service } = this;
    const data = await service.company.create(ctx.request.body);
    ctx.helper.success(data, '创建成功', 201);
  }

  async update() {
    const { ctx, service } = this;
    await service.company.update(ctx.params.id, ctx.request.body);
    ctx.status = 204;
    // ctx.helper.success(user, '编辑成功', 201);
  }

  async destroy() {
    const { ctx, service } = this;
    await service.company.destroy(ctx.params.id);
    ctx.helper.success(null, '删除成功', 200);
  }

  async editInfo() {
    const { ctx, service } = this;
    await service.company.editInfo(ctx.request.body);
    ctx.helper.success(null, '修改成功', 200);
  }

  async all() {
    const { ctx, service } = this;
    const data = await service.company.all(ctx.query.regionId);
    ctx.helper.success(data, '获取成功', 200);
  }
}

module.exports = CompanyController;
