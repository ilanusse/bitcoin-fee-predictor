const transactionModel = require('./transaction'),
  blockModel = require('./block');

exports.define = (orm, db) => {
  transactionModel.getModel(orm, db);
  blockModel.getModel(orm, db);
};
