/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-unresolved */
module.exports = require('./dist').default;

if (process.env.IS_GCP) {
    module.exports.server = require('./server').server;
}
