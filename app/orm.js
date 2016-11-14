const orm = require('orm'),
  config = require('./../config/config').config,
  tableCreation = require('./models/scripts/tableCreation'),
  models = require('./models/models');

const DB_URL = config.common.database.url ||
                `postgres://${config.common.database.username}:${config.common.database.password}@${config.common.database.host}:${config.common.database.port}/${config.common.database.database}`;
const dbModels = {};

exports.init = (app, cb) => {
  tableCreation.execute(DB_URL);

  orm.connect(DB_URL, function (err, db) {
    if (err) {
      throw err;
    }

    models.define(orm, db);
    dbModels.models = db.models;
    cb();
  });
};

exports.models = dbModels;
exports.DB_URL = DB_URL;
