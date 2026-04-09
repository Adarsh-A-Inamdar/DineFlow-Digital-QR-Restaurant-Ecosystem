const morgan = require('morgan');

// For now, we use morgan for HTTP request logging
const logger = morgan('dev');

module.exports = logger;
