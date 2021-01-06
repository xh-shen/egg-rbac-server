'use strict';

const Controller = require('egg').Controller;


// const formRule = {
//   username: { type: 'string', required: true },
//   email: { type: 'string', required: true },
// };

class RoleController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = await service.role.index(ctx.query);
    ctx.helper.success(data);
  }

  async show() {
    const { ctx, service } = this;
    const data = await service.role.show(ctx.params.id);
    ctx.helper.success(data);
  }

  async create() {
    const { ctx, service } = this;
    // ctx.validate(formRule);
    const data = await service.role.create(ctx.request.body);
    ctx.helper.success(data, '创建成功', 201);
  }

  async update() {
    const { ctx, service } = this;
    await service.role.update(ctx.params.id, ctx.request.body);
    ctx.status = 204;
    // ctx.helper.success(user, '编辑成功', 201);
  }

  async destroy() {
    const { ctx, service } = this;
    await service.role.destroy(ctx.params.id);
    ctx.helper.success(null, '删除成功', 200);
  }

  async all() {
    const { ctx, service } = this;
    const data = await service.role.all();
    ctx.helper.success(data, '获取成功', 200);
  }

  async setUser() {
    const { ctx, service } = this;
    const data = await service.role.setUser(ctx.params.id, ctx.request.body.userIds);
    ctx.helper.success(data, '关联成功', 200);
  }

  async getPermission() {
    const { ctx, service } = this;
    const data = await service.role.getPermission(ctx.params.id);
    ctx.helper.success(data, '获取权限成功', 200);
  }

  async setPermission() {
    const { ctx, service } = this;
    const data = await service.role.setPermission(ctx.params.id, ctx.request.body.permissionIds);
    ctx.helper.success(data, '授权成功', 200);
  }
}

module.exports = RoleController;

