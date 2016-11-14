const Promise = require('bluebird');

exports.getModel = (orm, db) => {
  const tx = db.define('transaction', {
    hash:     { type: 'text', key: true, required: true },
    spb:     { type: 'number', key: true, required: true }, // Satoshis per byte
    block_count: { type: 'integer' },
    timestamp: { type: 'integer', required: true }
  });
  return Promise.promisifyAll(tx);
};
