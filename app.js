const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  cors = require('cors'),
  config = require('./config/config').config,
  routes = require('./app/routes'),
  orm = require('./app/orm'),
  liveService = require('./app/services/bitcoinService');

const init = () => {
  const app = express();
  module.exports = app;

  // Client must send "Content-Type: application/json" header
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  morgan.token('req-params', (req) => req.params);
  app.use(morgan('[:date[clf]] :remote-addr - Request ":method :url" with params: :req-params. Response status: :status.'));

  orm.init(app, () => {
    routes.init(app);
    liveService.init();
    app.listen(config.common.port || 8080);
  });
};

init();
