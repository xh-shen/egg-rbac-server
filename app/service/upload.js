'use strict';
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const ObsClient = require('esdk-obs-nodejs');
const Service = require('egg').Service;

class UploadService extends Service {
  async obs() {
    const obsClient = new ObsClient({
      access_key_id: this.config.obsClient.access_key_id,
      secret_access_key: this.config.obsClient.secret_access_key,
      server: this.config.obsClient.server,
    });
    return obsClient;
  }

  async compileExcel(filePath) {
    const data = [];
    let err = null;
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetNames = workbook.SheetNames; // 获取所有工作薄名
      const sheet1 = workbook.Sheets[sheetNames[7]];
      const range = XLSX.utils.decode_range(sheet1['!ref']);
      console.log(range);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const row = [];
        let flag = false;
        for (let C = range.s.c; C <= range.e.c; ++C) {
          let rowValue = null;
          const cellAddress = { c: C, r: R }; // 获取单元格地址
          const cell = XLSX.utils.encode_cell(cellAddress); // 根据单元格地址获取单元格
          if (sheet1[cell]) {
            // 获取单元格值
            rowValue = sheet1[cell].v;
          } else rowValue = '';
          row.push(rowValue);
        }
        // 判断整行是否都为空，是则去掉
        for (let i = 0; i < row.length; i++) {
          if (row[i] !== '') {
            flag = true;
            break;
          }
        }
        if (flag) data.push(row);
      }
    } catch (e) {
      console.log(e.toString());
      err = '解析出错' + e.toString();
    }
    return {
      err,
      data,
    };
  }

  async picture() {
    const { ctx } = this;
    const obsClient = await this.obs();
    const stream = await ctx.getFileStream();
    const baseDir = ctx.app.baseDir;
    const filename = `photo_${Date.now()}_${Math.random()}${path.extname(
      stream.filename
    )}`;
    const dirPath = path.join(baseDir, './app/public/upload');
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) {
      fs.mkdirSync(dirPath);
    }

    const target = path.join(baseDir, './app/public/upload', filename);
    const writeStream = fs.createWriteStream(target);
    let url;
    try {
      await awaitWriteStream(stream.pipe(writeStream));
      await obsClient.putObject({
        Bucket: this.config.obsClient.bucket,
        Key: `${this.config.obsClient.key}/${filename}`,
        Body: fs.createReadStream(target),
      });
      fs.unlinkSync(target);
      url = `${this.config.obsClient.url}/${filename}`;
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }
    return {
      url,
    };
  }

  async multiple() {
    const { ctx } = this;
    const obsClient = await this.obs();
    console.log(obsClient);
    const stream = await ctx.getFileStream();
    const baseDir = ctx.app.baseDir;
    const extname = path.extname(stream.filename);
    const basename = path.basename(stream.filename, extname);
    console.log(basename);
    if (
      !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
        basename
      )
    ) {
      ctx.throw(409, `${stream.filename}名称不是身份证格式！`);
    }

    const filename = `photo_${Date.now()}_${Math.random()}${extname}`;
    const dirPath = path.join(baseDir, './app/public/excel');
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) {
      fs.mkdirSync(dirPath);
    }
    const data = await ctx.model.Photos.findOne({
      where: {
        cardNo: basename,
      },
    });
    const target = path.join(baseDir, './app/public/excel', filename);
    const writeStream = fs.createWriteStream(target);
    let url;
    try {
      await awaitWriteStream(stream.pipe(writeStream));
      await obsClient.putObject({
        Bucket: this.config.obsClient.bucket,
        Key: `${this.config.obsClient.key}/${filename}`,
        Body: fs.createReadStream(target),
      });
      // fs.unlinkSync(target);
      url = `${this.config.obsClient.url}/${filename}`;
      if (data) {
        await data.update({ photo: url });
      } else {
        await ctx.model.Photos.create({
          cardNo: basename,
          photo: url,
        });
      }
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }
    return {
      url,
    };
  }

  async importCompany() {
    const { ctx } = this;
    const baseDir = ctx.app.baseDir;
    const excelTitle = [
      '*公司名称',
      '公司电话',
      '公司联系人',
      '公司联系人电话',
      '公司邮箱',
      '公司网址',
    ];
    // const rules = [
    //   { reg: /.{2,100}/, name: '公司名称' },
    //   { reg: /.{2,100}/, name: '公司电话' }
    // ]
    const filePath = path.join(baseDir, './app/public/upload', 'company.xlsx');
    const { err, data } = await this.compileExcel(filePath);
    if (err) {
      ctx.throw(409, 'excel解析出错，请重试');
    }
    const tableTitle = data[2];
    const checkTableTitle = excelTitle.some((item, index) => {
      return tableTitle[index].trim() !== item;
    });
    if (checkTableTitle) {
      ctx.throw(409, 'excel模版有误，请修改');
    }
    data.splice(0, 3);
    // this.checkField(data)
    const errors = [];
    for (let row = 0; row < data.length; row++) {
      const currentRow = data[row];
      for (let col = 0; col < currentRow.length; col++) {
        if (col === 0) {
          if (!currentRow[col].trim()) {
            errors.push({
              row: row + 4,
              col: col + 1,
              msg: '公司名称是必填项！',
            });
          } else if (
            currentRow[col].length > 100 ||
            currentRow[col].length < 2
          ) {
            errors.push({
              row: row + 4,
              col: col + 1,
              msg: '公司名称长度必须在2到100个字符之间！',
            });
          }
        } else if (col === 1) {
          if (
            currentRow[col].trim() &&
            !/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
              currentRow[col].trim()
            )
          ) {
            errors.push({
              row: row + 4,
              col: col + 1,
              msg: '公司电话格式不正确！',
            });
          }
        } else if (col === 2) {
          if (
            currentRow[col].trim() &&
            (currentRow[col].length > 10 || currentRow[col].length < 2)
          ) {
            errors.push({
              row: row + 4,
              col: col + 1,
              msg: '公司联系人长度必须在2到10个字符之间！',
            });
          }
        } else if (col === 3) {
          if (
            currentRow[col].trim() &&
            !/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
              currentRow[col].trim()
            )
          ) {
            errors.push({
              row: row + 4,
              col: col + 1,
              msg: '公司联系人电话格式不正确！',
            });
          }
        } else if (col === 4) {
          if (
            currentRow[col].trim() &&
            !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
              currentRow[col].trim()
            )
          ) {
            errors.push({
              row: row + 4,
              col: col + 1,
              msg: '公司邮箱格式不正确！',
            });
          }
        } else if (col === 5) {
          if (
            currentRow[col].trim() &&
            !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
              currentRow[col].trim()
            )
          ) {
            errors.push({
              row: row + 4,
              col: col + 1,
              msg: '公司网址格式不正确！',
            });
          }
        }
      }
    }
    if (errors.length > 0) {
      return {
        error: true,
        errors,
      };
    }

    const bulkData = data.map(item => ({
      name: item[0],
      mobile: item[1],
      contacts: item[2],
      contactsMobile: item[3],
      email: item[4],
      website: item[5],
      gasRegionId: 1,
    }));
    await ctx.model.Company.bulkCreate(bulkData);
    return {
      error: false,
      errors,
    };
    // console.log(data);
  }

  // async importStaff() {
  //   const { ctx } = this;
  //   const baseDir = ctx.app.baseDir;
  //   const excelTitle = [
  //     '序号',
  //     '单位名称*',
  //     '姓名*',
  //     '性别*',
  //     '身份证号*',
  //     '工号',
  //     '手机号*',
  //     '职务',
  //     '负责辖区',
  //     '工作照*',
  //   ];
  //   const filePath = path.join(
  //     baseDir,
  //     './app/public/upload',
  //     '延边州/延边州燃气人员基本信息统计表.xlsx'
  //   );

  //   const { err, data } = await this.compileExcel(filePath);
  //   if (err) {
  //     ctx.throw(409, 'excel解析出错，请重试');
  //   }
  //   const company = await ctx.model.Company.findAll({
  //     attributes: [ 'id', 'name', 'gasRegionId' ],
  //     raw: true,
  //   });

  //   const tableTitle = data[1];
  //   const checkTableTitle = excelTitle.some((item, index) => {
  //     return tableTitle[index].trim() !== item;
  //   });
  //   console.log(excelTitle, tableTitle);
  //   // if (checkTableTitle) {
  //   //   ctx.throw(409, 'excel模版有误，请修改');
  //   // }
  //   data.splice(0, 2);
  //   const bulkData = data.map((item, index) => {
  //     console.log(item[1].trim());
  //     const temp = company.find(cmp => cmp.name.trim() === item[1].trim());
  //     console.log(item, index);
  //     if (!temp) {
  //       ctx.throw(409, 'excel模版有误，请修改');
  //     }
  //     return {
  //       gasRegionId: temp.gasRegionId,
  //       gasCompanyId: temp.id,
  //       name: item[2],
  //       sex: item[3].trim() === '男' ? 1 : 2,
  //       cardNo: item[4],
  //       jobNumber: item[5],
  //       mobile: item[6] + '',
  //       job: item[7],
  //       jurisdiction: item[8],
  //       status: 1,
  //     };
  //   });
  //   // await ctx.model.Staff.bulkCreate(bulkData);
  //   return data;
  // }
}

module.exports = UploadService;
