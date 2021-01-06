'use strict';
const Service = require('egg').Service;
const moment = require('moment');

class MenuService extends Service {
  async show(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const menu = await ctx.model.Menu.findOne({
      where: { id },
      attributes: { exclude: [ 'updatedAt' ] },
    });
    if (!menu) {
      ctx.throw(404, '菜单不存在');
    }
    return menu;
  }

  async index() {
    const { app } = this;
    const menus = await app.redis.get('gas_menus');
    return menus ? JSON.parse(menus) : [];
  }

  async create(body) {
    const { ctx, app } = this;
    const menu = await ctx.model.Menu.findOne({
      where: {
        code: body.code,
      },
    });
    if (menu) {
      ctx.throw(409, '菜单编号已存在');
    }
    const { id } = await app.model.transaction({}, async transaction => {
      const permission = await ctx.model.Permission.create(
        { type: 'menu' },
        { transaction }
      );
      const menu = await ctx.model.Menu.create(body, { transaction });
      await permission.setMenu(menu, { transaction });
      return menu;
    });
    await this.setMenuRedis();
    return { id };
  }

  async update(_id, body) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    const menu = await ctx.model.Menu.findByPk(id);
    if (!menu) {
      ctx.throw(404, '菜单不存在');
    }
    const otherMenu = await ctx.model.Menu.findOne({
      where: {
        id: {
          [app.Sequelize.Op.ne]: id,
        },
        code: body.code,
      },
    });
    if (otherMenu) {
      ctx.throw(409, '菜单编码已存在');
    }
    await menu.update(body);
    await this.setMenuRedis();
    return null;
  }

  async destroy(_id) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    const menu = await ctx.model.Menu.findByPk(id);
    if (!menu) {
      ctx.throw(404, '菜单不存在');
    }
    const childCount = await ctx.model.Menu.count({ where: { pid: id } });
    const elementCount = await ctx.model.Element.count({
      where: { gasMenuId: id },
    });
    const apiCount = await ctx.model.Api.count({ where: { gasMenuId: id } });
    if (childCount > 0 || elementCount > 0 || apiCount > 0) {
      ctx.throw(409, '先移除该菜单下子菜单、元素、接口后在删除');
    }
    await app.model.transaction({}, async transaction => {
      await menu.destroy({}, { transaction });
      await ctx.model.Permission.destroy(
        { id: menu.gasPermissionId },
        { transaction }
      );
      await ctx.model.Permission.destroy(
        { id: menu.gasPermissionId },
        { transaction }
      );
    });
    return {
      childCount,
      elementCount,
      apiCount,
    };
  }

  async setMenuRedis() {
    const { ctx, app } = this;
    let menus = await ctx.model.Menu.findAll({
      raw: true,
      order: [[ 'sort' ], [ 'createdAt', 'DESC' ]],
      attributes: { exclude: [ 'updatedAt' ] },
    });
    menus = menus.map(menu =>
      Object.assign({}, menu, {
        statusName: menu.status === 1 ? '启用' : '停用',
        createdAt: moment(menu.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      })
    );
    await app.redis.set('gas_menus', JSON.stringify(menus));
    return menus;
  }

  async getMenuRedis() {
    const { app } = this;
    const menusStr = await app.redis.get('gas_menus');
    if (menusStr) {
      return JSON.parse(menusStr);
    }
    return await this.setMenuRedis();
  }
}

module.exports = MenuService;
