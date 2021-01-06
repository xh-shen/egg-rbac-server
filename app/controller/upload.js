'use strict';
const Controller = require('egg').Controller;

class UploadController extends Controller {
  async picture() {
    const { ctx, service } = this;
    const data = await service.upload.picture();
    ctx.helper.success(data, '上传成功');
  }

  async multiple() {
    const { ctx, service } = this;
    const data = await service.upload.multiple();
    ctx.helper.success(data, '上传成功');
  }

  async importCompany() {
    const { ctx, service } = this;
    const data = await service.upload.importCompany();
    ctx.helper.success(data, data.error ? '导入失败' : '导入成功');
  }

  // async importStaff() {
  //   const { ctx, service } = this;
  //   const data = await service.upload.importStaff();
  //   ctx.helper.success(data, '导入成功');
  // }
}

module.exports = UploadController;
