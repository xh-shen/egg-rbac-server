'use strict';
const fs = require('fs');
const path = require('path');
const Subscription = require('egg').Subscription;

class DeleteTempfile extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 1 * * *', // 每天凌晨1点删除临时文件
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }
  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.log(124124124);
    const baseDir = this.ctx.app.baseDir;
    const dirPath = path.join(baseDir, './app/public/excel');
    fs.readdirSync(dirPath).forEach(file => {
      fs.unlink(`${dirPath}/${file}`, err => {
        if (err) {
          console.log(err);
        } else {
          console.log('delete ok');
        }
      });
    });
  }
}

module.exports = DeleteTempfile;
