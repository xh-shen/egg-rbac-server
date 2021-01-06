'use strict';
const Service = require('egg').Service;
const moment = require('moment');

class PermissionService extends Service {
  async show(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const permission = await ctx.model.Permission.findByPk(id);
    if (!permission) {
      ctx.throw(404, '权限不存在');
    }
    return permission;
  }

  async create(body) {
    const { ctx } = this;
    const permission = await ctx.model.Permission.findOne({
      where: {
        code: body.code,
      },
    });
    if (permission) {
      ctx.throw(409, '权限编码已存在');
    }
    const { id } = await ctx.model.Permission.create(body);
    await this.permissionsTree();
    return { id };
  }

  async update(_id, body) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    const permission = await ctx.model.Permission.findByPk(id);
    if (!permission) {
      ctx.throw(404, '权限不存在');
    }
    const permission2 = await ctx.model.Permission.findOne({
      where: {
        id: {
          [app.Sequelize.Op.ne]: id,
        },
        code: body.code,
      },
    });
    if (permission2) {
      ctx.throw(409, '权限编码已存在');
    }
    await permission.update(body);
    const roles = await permission.getRoles({ raw: true, attributes: [ 'id' ] });
    await this.setRolePermissionRedis(roles, id, body);
    await this.permissionsTree();
    return null;
  }

  sonsTree(obj, arr) {
    const children = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].pid === obj.id) {
        this.sonsTree(arr[i], arr);
        children.push(arr[i]);
      }
    }
    obj.children = children;
    obj.statusName = obj.status === 1 ? '启用' : '停用';
    obj.isRouterName = obj.isRouter === 1 ? '是' : '否';
    obj.isMenuName = obj.isMenu === 1 ? '是' : '否';
    obj.createdAt = moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss');
    return obj;
  }

  async permissionsTree() {
    const { ctx, app } = this;
    const permissions = await ctx.model.Permission.findAll({
      raw: true,
      order: [[ 'sort' ], [ 'createdAt', 'DESC' ]],
      attributes: { exclude: [ 'updatedAt' ] },
    });
    for (let i = 0; i < permissions.length; i++) {
      const obj = permissions[i];
      obj.statusName = obj.status === 1 ? '启用' : '停用';
      obj.isRouterName = obj.isRouter === 1 ? '是' : '否';
      obj.isMenuName = obj.isMenu === 1 ? '是' : '否';
      obj.createdAt = moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss');
    }

    await app.redis.set('gas_permissions', JSON.stringify(permissions));
    return null;
  }

  async setRolePermissionRedis(roles, perId, body) {
    const { app } = this;
    roles.forEach(async role => {
      const currentPer = await app.redis.get(`gas_role${role.id}`);
      if (currentPer) {
        const arr = JSON.parse(currentPer);
        const index = arr.findIndex(per => per.id === perId);
        if (body.status === 0) {
          arr.splice(index, 1);
        } else {
          arr[index] = body;
        }
        await app.redis.set(`gas_role${role.id}`, JSON.stringify(arr));
      }
    });
  }
}

module.exports = PermissionService;
