'use strict';

const whiteUrl = [
  '/admin/v1/user/password/edit',
  '/admin/v1/user/info',
  '/admin/v1/user/info/edit',
  '/admin/v1/company/info/edit',
];

function RegExpUrl(url1, url2) {
  const reg = url1.replace(/:\w+\/?/, '(.+/?)');
  const regex = new RegExp(`^${reg}$`);
  return regex.test(url2);
}

module.exports = app => {
  return async function checkApi(ctx, next) {
    const token = ctx.request.headers.authorization.split(' ')[1];
    const { roleIds, isSuper, username } = ctx.state.user;
    const timestamp = new Date().getTime();
    let auth = await app.redis.get('gas_auth');
    auth = auth ? JSON.parse(auth) : {};

    if (!auth[username]) {
      ctx.throw(401, '登录信息有误，请重新登录！');
    } else if (auth[username] && auth[username].token !== token) {
      ctx.throw(401, '该账号已在其他地方登录，请重新登录！！');
    } else {
      if (timestamp > auth[username].timestamp) {
        delete auth[username];
        await app.redis.set('gas_auth', JSON.stringify(auth));
        ctx.throw(401, '长时间未操作，请重新登录！');
      } else {
        auth[username] = {
          token,
          timestamp: timestamp + ctx.app.config.expireIn,
        };
        await app.redis.set('gas_auth', JSON.stringify(auth));

        if (isSuper) {
          await next();
        } else {
          const reqUrl = ctx.url.split('?')[0];
          const apis = await ctx.service.api.getApiRedis();
          let permissions = [];
          for (let i = 0; i < roleIds.length; i++) {
            const r = await app.redis.get(`gas_role${roleIds[i]}`);
            if (r) {
              permissions.push(...JSON.parse(r));
            }
          }
          permissions = [
            ...new Set(
              permissions
                .filter(item => item.type === 'api')
                .map(item => item.id)
            ),
          ];

          const allowApis = apis
            .filter(
              item =>
                !!item.status && permissions.includes(item.gasPermissionId)
            )
            .map(item => ({
              path: item.path,
              method: item.method,
              name: item.name,
            }));
          if (whiteUrl.includes(reqUrl)) {
            await next();
          } else {
            const index = allowApis.findIndex(
              item => item.method === ctx.method && RegExpUrl(item.path, reqUrl)
            );
            if (index > -1) {
              await next();
            } else {
              const api = apis.find(
                item =>
                  item.method === ctx.method && RegExpUrl(item.path, reqUrl)
              );
              const errMsg = api
                ? `没有访问“${api.name}”接口权限`
                : '没有访问接口权限';
              ctx.throw(403, errMsg);
            }
          }
        }
      }
    }
  };
};
