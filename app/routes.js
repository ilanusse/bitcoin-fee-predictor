const feesController = require('./controllers/bitcoinController');

exports.init = (app) => {

  app.get('/fees', [], feesController.predictions);
};
