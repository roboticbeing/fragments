// TODO: In future, add AWS back-end strategy option

// Use Memory DB
if (process.env.DB == 'Memory') {
    module.exports = require('./memory');
  }
  // In all other cases, we need to stop now and fix our config
  else {
    throw new Error('missing env vars: no database configuration found');
  }