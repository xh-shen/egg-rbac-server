'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error =
        status === 500 && ctx.app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message;

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = { error };
      if (status === 422) {
        ctx.body.detail = err.errors;
        ctx.body.msg = '参数错误';
      } else if (status === 401 && ctx.body.error.indexOf('jwt') > -1) {
        ctx.body.msg = 'token过期或不合法，请重新登录';
      } else {
        let msg = '';
        if (err.errors) {
          msg = err.errors.map(err => err.message).join(',');
        } else {
          msg = err.message;
        }
        delete ctx.body.error;
        ctx.body.msg = msg || '服务端错误';
      }
      ctx.status = status;
    }
  };
};
