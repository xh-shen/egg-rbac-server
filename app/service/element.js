'use strict';
const Service = require('egg').Service;

class ElementService extends Service {
  async show(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const element = await ctx.model.Element.findOne({
      where: { id },
      attributes: { exclude: [ 'updatedAt' ] },
    });
    if (!element) {
      ctx.throw(404, '元素不存在');
    }
    return element;
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
          code: {
            [Op.like]: `%${payload.keyword}%`,
          },
        },
        {
          name: {
            [Op.like]: `%${payload.keyword}%`,
          },
        },
      ],
    };
    if (payload.status) {
      where.status = payload.status;
    }
    const elements = await ctx.model.Element.findAndCountAll({
      offset,
      limit,
      where,
      order: [[ 'gasMenuId' ], [ 'createdAt' ]],
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
      total: elements.count,
      list: elements.rows,
    };
  }

  async create(body) {
    const { ctx, app } = this;
    if (!body.gasMenuId) {
      ctx.throw(409, '所属菜单必须选择');
    }
    const element = await ctx.model.Element.findOne({
      where: {
        code: body.code,
      },
    });
    if (element) {
      ctx.throw(409, '元素编号已存在');
    }
    const { id } = await app.model.transaction({}, async transaction => {
      const permission = await ctx.model.Permission.create(
        { type: 'element' },
        { transaction }
      );
      const element = await ctx.model.Element.create(body, { transaction });
      await permission.setElement(element, { transaction });
      return element;
    });
    await this.setElementRedis();
    return { id };
  }

  async update(_id, body) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    if (!body.gasMenuId) {
      ctx.throw(409, '所属菜单必须选择');
    }
    const element = await ctx.model.Element.findByPk(id);
    if (!element) {
      ctx.throw(404, '元素不存在');
    }
    const other = await ctx.model.Element.findOne({
      where: {
        id: {
          [app.Sequelize.Op.ne]: id,
        },
        code: body.code,
      },
    });
    if (other) {
      ctx.throw(409, '元素编码已存在');
    }
    await element.update(body);
    await this.setElementRedis();
    return null;
  }

  async setElementRedis() {
    const { ctx, app } = this;
    let elements = await ctx.model.Element.findAll({
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
    elements = elements.map(el =>
      Object.assign({}, el, {
        label: el.name,
        menuName: el['menu.name'],
      })
    );
    await app.redis.set('gas_elements', JSON.stringify(elements));
    return elements;
  }

  async getElementRedis() {
    const { app } = this;
    const elementsStr = await app.redis.get('gas_elements');
    if (elementsStr) {
      return JSON.parse(elementsStr);
    }
    return await this.setElementRedis();
  }
}

module.exports = ElementService;
