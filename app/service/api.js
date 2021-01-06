'use strict';
const Service = require('egg').Service;

class ApiService extends Service {
  async show(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const api = await ctx.model.Api.findOne({
      where: { id },
      attributes: { exclude: [ 'updatedAt' ] },
    });
    if (!api) {
      ctx.throw(404, '接口不存在');
    }
    return api;
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
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${payload.keyword}%`,
          },
        },
        {
          path: {
            [Op.like]: `%${payload.keyword}%`,
          },
        },
      ],
    };
    if (payload.status) {
      where.status = payload.status;
    }
    if (payload.method) {
      where.method = payload.method;
    }
    const apis = await ctx.model.Api.findAndCountAll({
      offset,
      limit,
      where,
      order: [[ 'gasMenuId' ], [ 'createdAt', 'DESC' ]],
      attributes: { exclude: [ 'updatedAt' ] },
      include: [
        {
          model: ctx.model.Menu,
          as: 'menu',
          attributes: [ 'id', 'name' ],
        },
      ],
    });
    return {
      total: apis.count,
      list: apis.rows,
    };
  }

  async create(body) {
    const { ctx, app } = this;
    const api = await ctx.model.Api.findOne({
      where: {
        path: body.path,
        method: body.method,
      },
    });
    if (api) {
      ctx.throw(409, '接口路径和方法不能全部相同');
    }
    const { id } = await app.model.transaction({}, async transaction => {
      const permission = await ctx.model.Permission.create(
        { type: 'api' },
        { transaction }
      );
      const api = await ctx.model.Api.create(body, { transaction });
      await permission.setApi(api, { transaction });
      return api;
    });
    await this.setApiRedis();
    return { id };
  }

  async update(_id, body) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    const api = await ctx.model.Api.findByPk(id);
    if (!api) {
      ctx.throw(404, '接口不存在');
    }
    const other = await ctx.model.Api.findOne({
      where: {
        id: {
          [app.Sequelize.Op.ne]: id,
        },
        path: body.path,
        method: body.method,
      },
    });
    if (other) {
      ctx.throw(409, '接口路径和方法不能全部相同');
    }
    await api.update(body);
    await this.setApiRedis();
    return null;
  }

  async setApiRedis() {
    const { ctx, app } = this;
    let apis = await ctx.model.Api.findAll({
      raw: true,
      order: [[ 'gasMenuId' ]],
      attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
      include: [
        {
          model: ctx.model.Menu,
          as: 'menu',
          attributes: [ 'id', 'name' ],
        },
      ],
    });
    apis = apis.map(api =>
      Object.assign({}, api, {
        label: api.name,
        gasMenuId: api.gasMenuId ? api.gasMenuId : 0,
        menuName: api['menu.name'] ? api['menu.name'] : '公共',
      })
    );
    await app.redis.set('gas_apis', JSON.stringify(apis));
    return apis;
  }

  async getApiRedis() {
    const { app } = this;
    const apisStr = await app.redis.get('gas_apis');
    if (apisStr) {
      return JSON.parse(apisStr);
    }
    return await this.setApiRedis();
  }
}

module.exports = ApiService;
