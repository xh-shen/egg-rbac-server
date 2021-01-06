'use strict';
const Service = require('egg').Service;

class RoleService extends Service {
  async show(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const role = await ctx.model.Role.findOne({
      where: { id },
      attributes: { exclude: [ 'updatedAt' ] },
      include: [
        {
          through: { attributes: [] },
          model: ctx.model.User,
          as: 'users',
          attributes: [ 'id', 'name', 'username' ],
          where: { status: 1 },
          required: false,
        },
      ],
    });
    if (!role) {
      ctx.throw(404, '角色不存在');
    }
    const users = role.getDataValue('users');
    role.setDataValue('userIds', users.map(item => item.id));
    return role;
  }

  async index(payload) {
    const {
      ctx,
      app: {
        Sequelize: { Op },
      },
    } = this;
    const page = ctx.helper.parseInt(payload.page) || 1;
    const limit = ctx.helper.parseInt(payload.limit) || 2;
    const offset = (page - 1) * limit;
    const where = {
      name: {
        [Op.like]: `%${payload.keyword}%`,
      },
    };
    if (payload.status) {
      where.status = payload.status;
    }
    const roles = await ctx.model.Role.findAndCountAll({
      offset,
      limit,
      where,
      order: [[ 'createdAt', 'DESC' ]],
      attributes: { exclude: [ 'updatedAt' ] },
    });
    return {
      total: roles.count,
      list: roles.rows,
    };
  }

  async create(body) {
    const { ctx } = this;
    const { id } = await ctx.model.Role.create(body);
    return { id };
  }

  async update(_id, body) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(404, '角色不存在');
    }
    await role.update(body);
    return null;
  }

  async destroy(_id) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    const role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(404, '角色不存在');
    }
    const { roleIds, isSuper } = ctx.state.user;
    const roleArr = [ ...roleIds ];
    if (roleArr.includes(id) && !isSuper) {
      ctx.throw(401, '不能删除当前登录账户的角色');
    }
    await app.model.transaction({}, async transaction => {
      await role.destroy({}, { transaction });
      await role.setUsers([], { transaction });
      await role.setPermissions([], { transaction });
    });
    return null;
  }

  async all() {
    const { ctx } = this;
    const roles = await ctx.model.Role.findAll({
      where: { status: 1 },
      attributes: [ 'id', 'name', 'status' ],
    });
    return roles;
  }

  async setUser(_id, userIds) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    const role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(404, '角色不存在');
    }
    const { id: userId, roleIds, isSuper } = ctx.state.user;

    if (!userIds.includes(userId) && roleIds.includes(id) && !isSuper) {
      ctx.throw(401, '不能移除该角色的登录用户');
    }
    await app.model.transaction({}, async transaction => {
      const users = await ctx.model.User.findAll({
        where: { id: userIds },
        transaction,
      });
      await role.setUsers(users, { transaction });
      return true;
    });
    return null;
  }

  async getPermission(_id) {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(_id);
    // const user = ctx.state.user;
    const role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(404, '角色不存在');
    }
    let menus = await service.menu.getMenuRedis();
    menus = menus.filter(item => item.status && item.isSuper === 0);
    const elements = await service.element.getElementRedis();
    const apis = await service.api.getApiRedis();
    const permissions = await role.getPermissions({ raw: true });
    return {
      menus: {
        list: menus,
        selected: permissions
          .filter(item => item.type === 'menu')
          .map(item => item.id)
          .filter(perId => {
            const current = menus.findIndex(
              item => item.gasPermissionId === perId
            );
            return !menus.find(item => item.pid === menus[current].id);
          }),
      },
      elements: {
        list: elements.filter(item => item.status),
        selected: permissions
          .filter(item => item.type === 'element')
          .map(item => item.id),
      },
      apis: {
        list: apis.filter(item => item.status),
        selected: permissions
          .filter(item => item.type === 'api')
          .map(item => item.id),
      },
    };
  }

  async setPermission(_id, permissionIds) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    const role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(404, '角色不存在');
    }

    const { roleIds, isSuper } = ctx.state.user;
    const roleArr = [ ...roleIds ];

    if (roleArr.includes(id) && !isSuper) {
      ctx.throw(401, '该角色授权不能修改，登录账户存在该角色');
    }
    await app.model.transaction({}, async transaction => {
      const permissions = await ctx.model.Permission.findAll({
        where: { id: permissionIds },
        transaction,
      });
      await role.setPermissions(permissions, { transaction });
      await this.setRolePermissionRedis(_id, permissions);
      return true;
    });
    return null;
  }

  async setRolePermissionRedis(id, permissions) {
    const { app } = this;
    await app.redis.set(`gas_role${id}`, JSON.stringify(permissions));
    return JSON.stringify(permissions);
  }
}

module.exports = RoleService;
