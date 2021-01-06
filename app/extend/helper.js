/*
 * @Author: shen
 * @Date: 2019-10-13 14:46:00
 * @LastEditors: shen
 * @LastEditTime: 2021-01-06 09:36:54
 * @Description:
 */
'use strict';
const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');
const privatePem = `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCTbXZ91+43DNmT5ph+o69UGmgSYr8g2peAOAyM62S2txT4xaFj
AkOEjNebw6rcwJZSbu+l/YOI8+EW+TfNLqie4nPg3eqHRDjScJFq81xblh6afKSo
wAMfCaZWL8kUdOZnOVB47LGhImKYbfwo82yygH0U4+tnojt+cTyKZcZXuwIDAQAB
AoGABSbEBy2uYzoNuD9MgNBTZgruLAZLS2iX9qD+v0XSZRgMoYy2UPFZTp5lQkoa
BFCub/70XMZ4/CYZbWYT7xV8StL9TqNgTeyoJl3fUwl7KtHHpD2jKowk5OHdNilj
legHLsYf0VIMGxTQp7xRhuxn/7FK+x6OiPv3tlOx/+l2FHECQQD4hGmgEK3SGY6Z
OltQ1GBV1/Z2sOjXcVeysZW2NnRSywtWidUOWWkxM9VwpZkHZfSWSebu5Aoodk8L
2j9xMcg/AkEAl93YMwODe7pQzm5vdgQJAdhpv9BnOVg0I4WhGz/6ugUigMgLLY5s
KDaGg5GsGcHeMI11xzu7/n/XmFLo3RrxhQJARzXR+l6tIAXYuYliPyAL1q1CXzJE
Fe/RXE/MgWDLJiouPobSOQFfxgx/PX8GAXuygRn+BTfsvTlhXxkTksDcCwJBAIwl
7p8lXvGPv4LB55rBno5VaUHa0WfaPkOJzmOXZ4rDslOmSKqCBM4Xg4tno6shfirQ
YSC7v4Hd+NhZqwxhEQECPz9Dad2mosSFtFz4pEg+BGakjxOAwSXLT8moOniJxcZM
7UTugiuih9q6HD1I9hoxT9QH2GFuy14OD7W+EoY0aQ==
-----END RSA PRIVATE KEY-----`;
const privateKey = new NodeRSA(privatePem);
privateKey.setOptions({ encryptionScheme: 'pkcs1' });

module.exports = {
  equal(rsa, data) {
    const sha = privateKey.decrypt(rsa, 'utf8');
    const hash = CryptoJS.SHA256(data);
    const sha2 = hash.toString(CryptoJS.enc.Hex);
    if (sha === sha2) {
      return true;
    }
    return false;
  },
  encrypt(content) {
    const encrypted = CryptoJS.AES.encrypt(content, this.ctx.app.config.secret);
    return encrypted.toString();
  },
  decrypt(content) {
    const bytes = CryptoJS.AES.decrypt(content, this.ctx.app.config.secret);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  },
  // 处理成功响应
  success(data = null, msg = '请求成功', status = 200) {
    this.ctx.status = status;
    // const _data =
    //   typeof data === 'object' ? this.encrypt(JSON.stringify(data)) : data;
    this.ctx.body = {
      msg,
      data,
    };
  },
  parseInt(string) {
    if (typeof string === 'number') return string;
    if (!string) return string;
    return parseInt(string) || 0;
  },
  setRandomPwd() {
    return Math.random()
      .toString(36)
      .slice(-8);
  },
  unique(arr, field) {
    const hash = {};
    const newArr = arr.reduce((item, next) => {
      hash[next[field]] ? '' : (hash[next[field]] = true && item.push(next));
      return item;
    }, []);

    return newArr;
  },
  arrayGroup(arr, field) {
    const obj = {};
    arr.forEach(item => {
      const current = {
        label: item.name,
        value: item.code,
        disabled: !item.status,
      };
      obj[item[field]]
        ? obj[item[field]].push(current)
        : (obj[item[field]] = [ current ]);
    });
    return obj;
  },
  arrayTransf(arr, keyMap) {
    return arr.map(item => {
      const result = {};
      for (const key in keyMap) {
        result[key] =
          keyMap[key][0] === '!'
            ? !item[keyMap[key].substr(1)]
            : item[keyMap[key]];
      }
      return result;
    });
  },
};
