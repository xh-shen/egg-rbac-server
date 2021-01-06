'use strict';
const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const axios = require('axios');
const ExcelJS = require('exceljs');
const moment = require('moment');

const BORDER = {
  top: { style: 'thin', color: { argb: 'FF333333' } },
  left: { style: 'thin', color: { argb: 'FF333333' } },
  bottom: { style: 'thin', color: { argb: 'FF333333' } },
  right: { style: 'thin', color: { argb: 'FF333333' } },
};

class StaffService extends Service {
  async show(_id) {
    const {
      ctx,
      app: { Sequelize },
    } = this;
    const id = ctx.helper.parseInt(_id);
    const data = await ctx.model.Staff.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'mobile',
        'sex',
        'cardNo',
        'jobNumber',
        'job',
        'jurisdiction',
        'photo',
        'sexName',
        'status',
        'statusName',
        [ Sequelize.col('region.name'), 'regionName' ],
        [ Sequelize.col('company.name'), 'companyName' ],
        [ Sequelize.col('photos.photo'), 'photoUrl' ],
      ],
      include: [
        {
          model: ctx.model.Region,
          as: 'region',
          attributes: [],
        },
        {
          model: ctx.model.Company,
          as: 'company',
          attributes: [],
          required: false,
        },
        {
          model: ctx.model.Photos,
          as: 'photos',
          attributes: [],
          required: false,
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
    const { type, gasRegionId, gasCompanyId } = ctx.state.user;
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
        {
          cardNo: {
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
      if (payload.gasCompanyId) {
        where.gasCompanyId = payload.gasCompanyId;
      }
    } else if (type === 2) {
      where.gasRegionId = gasRegionId;
      if (payload.gasCompanyId) {
        where.gasCompanyId = payload.gasCompanyId;
      }
    } else if (type === 3) {
      where.gasRegionId = gasRegionId;
      where.gasCompanyId = gasCompanyId;
    }

    const data = await ctx.model.Staff.findAndCountAll({
      offset,
      limit,
      where,
      order: [ 'gasRegionId', 'gasCompanyId', [ 'createdAt', 'DESC' ]],
      attributes: [
        'id',
        'name',
        'mobile',
        'sex',
        'cardNo',
        'jobNumber',
        'job',
        'jurisdiction',
        'photo',
        'sexName',
        'status',
        'statusName',
        [ Sequelize.col('region.name'), 'regionName' ],
        [ Sequelize.col('company.name'), 'companyName' ],
        [ Sequelize.col('photos.photo'), 'photoUrl' ],
      ],
      include: [
        {
          model: ctx.model.Region,
          as: 'region',
          attributes: [],
          required: false,
        },
        {
          model: ctx.model.Company,
          as: 'company',
          attributes: [],
          required: false,
        },
        {
          model: ctx.model.Photos,
          as: 'photos',
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
    const { type, gasRegionId, gasCompanyId } = ctx.state.user;
    if (type !== 3) {
      ctx.throw(409, '该用户无法新增员工！');
    }
    const data = await ctx.model.Staff.findOne({
      where: {
        cardNo: body.cardNo,
      },
    });
    if (data) {
      ctx.throw(409, '身份证号码已存在，无法添加！');
    }
    const { id } = await ctx.model.Staff.create(
      Object.assign({}, body, { gasRegionId, gasCompanyId })
    );
    return { id };
  }

  async update(_id, body) {
    const {
      ctx,
      app: {
        Sequelize: { Op },
      },
    } = this;
    const id = ctx.helper.parseInt(_id);
    const { type, gasRegionId, gasCompanyId } = ctx.state.user;
    if (type !== 3) {
      ctx.throw(409, '该用户无法修改员工！');
    }
    const data = await ctx.model.Staff.findByPk(id);
    if (!data) {
      ctx.throw(404, '员工不存在');
    }
    const staff = await ctx.model.Staff.findOne({
      where: {
        id: {
          [Op.ne]: id,
        },
        cardNo: body.cardNo,
      },
    });
    if (staff) {
      ctx.throw(409, '身份证号码已存在，无法修改！');
    }
    await data.update(Object.assign({}, body, { gasRegionId, gasCompanyId }));
    return null;
  }

  async destroy(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const data = await ctx.model.Staff.findByPk(id);
    if (!data) {
      ctx.throw(404, '员工不存在！');
    }
    const { type } = ctx.state.user;
    if (type !== 3) {
      ctx.throw(409, '该用户无法删除员工！');
    }
    await data.destroy({});

    return null;
  }

  async createExcel(columns, data, photos) {
    const { ctx } = this;
    const baseDir = ctx.app.baseDir;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    const worksheet = workbook.getWorksheet(1);
    worksheet.mergeCells('A1:K1');
    worksheet.autoFilter = 'A2:K2';
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.getRow(2).font = { size: 10, bold: true };
    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 20;
    sheet.getCell('A1').value = '燃气人员基本信息统计表';
    sheet.getRow(2).values = columns.map(item => item.header);
    columns.forEach((item, index) => {
      worksheet.getColumn(index + 1).width = item.width;
    });
    for (let i = 0; i < data.length; i++) {
      worksheet.addRow(data[i]);
    }
    const imageIds = [];
    for (let i = 0; i < photos.length; i++) {
      if (photos[i]) {
        const filename = photos[i].split('/').pop();
        const res = await axios({
          method: 'get',
          url: `http:${photos[i]}`,
          responseType: 'stream',
        });
        const target = path.join(baseDir, './app/public/excel', filename);
        const writeStream = fs.createWriteStream(target);
        try {
          await awaitWriteStream(res.data.pipe(writeStream));
        } catch (err) {
          await sendToWormhole(res.data);
          throw err;
        }
        const extname = path.extname(filename).substr(1);
        imageIds.push(
          workbook.addImage({
            buffer: fs.readFileSync(
              path.join(baseDir, './app/public/excel', filename)
            ),
            extension: extname === 'jpg' ? 'jpeg' : extname,
          })
        );
      } else {
        imageIds.push(null);
      }
    }
    worksheet.eachRow(function(row, rowNumber) {
      if (rowNumber >= 3) {
        worksheet.getRow(rowNumber).height = 110;
        worksheet.getRow(rowNumber).font = { size: 8 };
        worksheet.getCell(`K${rowNumber}`).border = BORDER;
        if (imageIds[rowNumber - 3] !== null) {
          worksheet.addImage(
            imageIds[rowNumber - 3],
            `K${rowNumber}:K${rowNumber}`
          );
        }
      }
      row.eachCell({ includeEmpty: true }, function(cell) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = BORDER;
      });
    });
    const filename = `燃气人员基本信息统计表_${moment(Date.now()).format(
      'YYYYMMDDHHmmss'
    )}_${Math.random()}.xlsx`;
    const filePath = path.join(baseDir, './app/public/excel', filename);
    await workbook.xlsx.writeFile(filePath);
    return filename;
  }

  async export(payload) {
    const {
      ctx,
      app: { Sequelize },
    } = this;
    const { Op } = Sequelize;
    const { type, gasRegionId, gasCompanyId } = ctx.state.user;
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
        {
          cardNo: {
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
      if (payload.gasCompanyId) {
        where.gasCompanyId = payload.gasCompanyId;
      }
    } else if (type === 2) {
      where.gasRegionId = gasRegionId;
      if (payload.gasCompanyId) {
        where.gasCompanyId = payload.gasCompanyId;
      }
    } else if (type === 3) {
      where.gasRegionId = gasRegionId;
      where.gasCompanyId = gasCompanyId;
    }

    const data = await ctx.model.Staff.findAll({
      where,
      order: [ 'gasRegionId', 'gasCompanyId', [ 'createdAt', 'DESC' ]],
      attributes: [
        'id',
        'name',
        'mobile',
        'sex',
        'cardNo',
        'jobNumber',
        'job',
        'jurisdiction',
        'photo',
        'status',
        [ Sequelize.col('region.name'), 'regionName' ],
        [ Sequelize.col('company.name'), 'companyName' ],
        [ Sequelize.col('photos.photo'), 'photoUrl' ],
      ],
      include: [
        {
          model: ctx.model.Region,
          as: 'region',
          attributes: [],
          required: false,
        },
        {
          model: ctx.model.Company,
          as: 'company',
          attributes: [],
          required: false,
        },
        {
          model: ctx.model.Photos,
          as: 'photos',
          attributes: [],
          required: false,
        },
      ],
      raw: true,
    });
    const excelData = data.map((item, index) => {
      const temp = [];
      temp[0] = index + 1;
      temp[1] = item.companyName;
      temp[2] = item.name;
      temp[3] = item.sex === 1 ? '男' : '女';
      temp[4] = item.cardNo;
      temp[5] = item.jobNumber;
      temp[6] = item.mobile;
      temp[7] = item.job;
      temp[8] = item.jurisdiction;
      temp[9] = item.regionName;
      return temp;
    });
    const photoArr = data.map(item => item.photo || item.photoUrl);
    const excelColumns = [
      { header: '序号', key: 'index', width: 10 },
      { header: '单位名称', key: 'companyName', width: 40 },
      { header: '姓名', key: 'name', width: 10 },
      { header: '性别', key: 'sexName', width: 10 },
      { header: '身份证号', key: 'cardNo', width: 20 },
      { header: '工号', key: 'jobNumber', width: 15 },
      { header: '手机号', key: 'mobile', width: 20 },
      { header: '职务', key: 'job', width: 15 },
      { header: '负责辖区', key: 'jurisdiction', width: 30 },
      { header: '所属地区', key: 'regionName', width: 15 },
      { header: '工作照', key: 'photo', width: 15 },
    ];
    const fileName = await this.createExcel(excelColumns, excelData, photoArr);
    return {
      url: `/excel/${fileName}`,
    };
  }
}

module.exports = StaffService;
