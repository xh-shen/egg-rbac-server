'use strict';
const Service = require('egg').Service;

class CompanyService extends Service {
  async show(_id) {
    const {
      ctx,
      app: { Sequelize },
    } = this;
    const id = ctx.helper.parseInt(_id);
    const data = await ctx.model.Company.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'mobile',
        'contacts',
        'contactsMobile',
        'email',
        'website',
        'gasRegionId',
        'status',
        'statusName',
        [ Sequelize.col('region.name'), 'regionName' ],
      ],
      include: [
        {
          model: ctx.model.Region,
          as: 'region',
          attributes: [],
        },
      ],
    });
    if (!data) {
      ctx.throw(404, '公司不存在');
    }
    return data;
  }

  async index(payload) {
    const {
      ctx,
      app: { Sequelize },
    } = this;
    const { Op } = Sequelize;
    const { type, gasRegionId } = ctx.state.user;
    const page = ctx.helper.parseInt(payload.page) || 1;
    const limit = ctx.helper.parseInt(payload.limit) || 2;
    const offset = (page - 1) * limit;
    const where = {
      [Op.or]: [
        {
          mobile: {
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
    if (type === 1 || type === 0) {
      if (payload.gasRegionId) {
        where.gasRegionId = payload.gasRegionId;
      }
    } else if (type === 2) {
      where.gasRegionId = gasRegionId;
    }

    const data = await ctx.model.Company.findAndCountAll({
      offset,
      limit,
      where,
      order: [ 'gasRegionId', [ 'createdAt', 'DESC' ]],
      attributes: [
        'id',
        'name',
        'mobile',
        'contacts',
        'contactsMobile',
        'email',
        'website',
        'status',
        'statusName',
        [ Sequelize.col('region.name'), 'regionName' ],
      ],
      include: [
        {
          model: ctx.model.Region,
          as: 'region',
          attributes: [],
          required: false,
        },
      ],
    });
    return {
      total: data.count,
      list: data.rows,
    };
  }

  async create(body) {
    const { ctx } = this;
    const { type, gasRegionId } = ctx.state.user;
    if (type !== 2) {
      ctx.throw(409, '该用户无法创建公司！');
    }
    const { id } = await ctx.model.Company.create(
      Object.assign({}, body, { gasRegionId })
    );
    return { id };
  }

  async update(_id, body) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const data = await ctx.model.Company.findByPk(id);
    if (!data) {
      ctx.throw(404, '公司不存在');
    }
    const { type, gasRegionId } = ctx.state.user;
    if (type !== 2) {
      ctx.throw(409, '该用户无法修改公司！');
    }
    await data.update(Object.assign({}, body, { gasRegionId }));
    return null;
  }

  async destroy(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const data = await ctx.model.Company.findByPk(id);
    if (!data) {
      ctx.throw(404, '公司不存在！');
    }
    const { type } = ctx.state.user;
    if (type !== 2) {
      ctx.throw(409, '该用户无法删除公司！');
    }

    const staff = await ctx.model.Staff.count({
      where: {
        gasCompanyId: id,
      },
    });

    if (staff > 0) {
      ctx.throw(409, '该公司下已有员工，无法删除！');
    }
    await data.destroy({});

    return null;
  }

  async editInfo(body) {
    const { ctx } = this;

    const { type, gasCompanyId } = ctx.state.user;
    if (type !== 3) {
      ctx.throw(409, '当前用户无法修改公司信息');
    }
    const data = await ctx.model.Company.findByPk(gasCompanyId);
    if (!data) {
      ctx.throw(404, '公司不存在');
    }
    await data.update(body);
    return null;
  }

  async all(gasRegionId) {
    const { ctx } = this;
    const regionId = ctx.helper.parseInt(gasRegionId);
    if (!gasRegionId) {
      return [];
    }
    const data = await ctx.model.Company.findAll({
      where: {
        gasRegionId: regionId,
      },
      attributes: [ 'id', 'name', 'status' ],
      raw: true,
    });
    const result = ctx.helper.arrayTransf(data, {
      label: 'name',
      value: 'id',
      disabled: '!status',
    });
    return result;
  }
}

module.exports = CompanyService;
