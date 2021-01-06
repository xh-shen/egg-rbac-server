'use strict';
const Service = require('egg').Service;

class RegionService extends Service {
  async all() {
    const { ctx } = this;
    const data = await ctx.model.Region.findAll({
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

module.exports = RegionService;
