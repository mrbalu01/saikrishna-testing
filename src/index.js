// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
require('module-alias/register');
const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const grpcServer = require('@communication/server')

// open mongoose connection


mongoose.connect();


// listen to requests
app.listen(port, () => logger.info(`Server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
