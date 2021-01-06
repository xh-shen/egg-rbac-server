'use strict';
// const NodeRSA = require('node-rsa');
// const crypto = require('crypto');
// // const fs = require('fs');
// const privatePem = `-----BEGIN RSA PRIVATE KEY-----
// MIICWwIBAAKBgQCTbXZ91+43DNmT5ph+o69UGmgSYr8g2peAOAyM62S2txT4xaFj
// AkOEjNebw6rcwJZSbu+l/YOI8+EW+TfNLqie4nPg3eqHRDjScJFq81xblh6afKSo
// wAMfCaZWL8kUdOZnOVB47LGhImKYbfwo82yygH0U4+tnojt+cTyKZcZXuwIDAQAB
// AoGABSbEBy2uYzoNuD9MgNBTZgruLAZLS2iX9qD+v0XSZRgMoYy2UPFZTp5lQkoa
// BFCub/70XMZ4/CYZbWYT7xV8StL9TqNgTeyoJl3fUwl7KtHHpD2jKowk5OHdNilj
// legHLsYf0VIMGxTQp7xRhuxn/7FK+x6OiPv3tlOx/+l2FHECQQD4hGmgEK3SGY6Z
// OltQ1GBV1/Z2sOjXcVeysZW2NnRSywtWidUOWWkxM9VwpZkHZfSWSebu5Aoodk8L
// 2j9xMcg/AkEAl93YMwODe7pQzm5vdgQJAdhpv9BnOVg0I4WhGz/6ugUigMgLLY5s
// KDaGg5GsGcHeMI11xzu7/n/XmFLo3RrxhQJARzXR+l6tIAXYuYliPyAL1q1CXzJE
// Fe/RXE/MgWDLJiouPobSOQFfxgx/PX8GAXuygRn+BTfsvTlhXxkTksDcCwJBAIwl
// 7p8lXvGPv4LB55rBno5VaUHa0WfaPkOJzmOXZ4rDslOmSKqCBM4Xg4tno6shfirQ
// YSC7v4Hd+NhZqwxhEQECPz9Dad2mosSFtFz4pEg+BGakjxOAwSXLT8moOniJxcZM
// 7UTugiuih9q6HD1I9hoxT9QH2GFuy14OD7W+EoY0aQ==
// -----END RSA PRIVATE KEY-----`;
// const privateKey = new NodeRSA(privatePem);
// privateKey.setOptions({ encryptionScheme: 'pkcs1' });

// function equal(opt) {
//   const { rsa, data } = opt;
//   const sha = privateKey.decrypt(rsa, 'utf8');
//   const hash = crypto.createHash('sha256');
//   hash.update(data);
//   const sha2 = hash.digest('hex');
//   if (sha === sha2) {
//     return true;
//   }
//   return false;
// }

module.exports = () => {
  return async function decrypt(ctx, next) {
    if (JSON.stringify(ctx.request.body) !== '{}') {
      // const { body } = ctx.request;
      let { data, rsa } = ctx.request.body;
      data = ctx.helper.decrypt(data);
      if (!ctx.helper.equal(rsa, JSON.stringify(data))) {
        ctx.throw(422, '参数错误！');
      }
      ctx.request.body = data;
    }
    // if (JSON.stringify(ctx.query) !== '{}') {
    //   let { data, rsa } = ctx.query;
    //   data = ctx.helper.decrypt(data);
    //   if (!ctx.helper.equal(rsa, JSON.stringify(data))) {
    //     ctx.throw(422, '参数错误！');
    //   }
    //   ctx.query = data;
    // }
    await next();
  };
};
