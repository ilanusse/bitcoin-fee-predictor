const Promise = require('bluebird');

exports.getModel = (orm, db) => {
  const block = db.define('block', {
    hash:     { type: 'text', key: true, required: true },
    timestamp: { type: 'integer', required: true }
  });
  return Promise.promisifyAll(block);
};
