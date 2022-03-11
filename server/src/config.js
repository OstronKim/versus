const path = require('path')

module.exports = {
  filesDir: path.join(__dirname, '..', 'files'),
  // ip: 'localhost',
  ip: '0.0.0.0',
  secretKey: process.env.SECRET_KEY || 'very-nice-dev-secret',
  port: process.env.PORT || 3000,
  development: {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'database.sqlite'
  },
  production: {
    // host: process.env.HOST,
    host: '0.0.0.0',
    dialect: 'sqlite',
    storage: 'database.sqlite'
  }
}
