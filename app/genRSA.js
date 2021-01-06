'use strict';

const NodeRSA = require('node-rsa');
const fs = require('fs');
function generator() {
  const key = new NodeRSA({ b: 1024 });
  key.setOptions({ encryptionScheme: 'pkcs1' });
  const privatePem = key.exportKey('private');
  const publicPem = key.exportKey('public');
  fs.writeFile('./pem/public.pem', publicPem, err => {
    if (err) throw err;
    console.log('公钥已保存！');
  });
  fs.writeFile('./pem/private.pem', privatePem, err => {
    if (err) throw err;
    console.log('私钥已保存！');
  });
}
generator();
