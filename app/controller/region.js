'use strict';

const Controller = require('egg').Controller;

class RegionController extends Controller {
  async all() {
    const { ctx, service } = this;
    const data = await service.region.all();
    ctx.helper.success(data, '获取成功', 200);
  }
}

module.exports = RegionController;
