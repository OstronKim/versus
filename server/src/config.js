const path = require('path')

module.exports = {
  filesDir: path.join(__dirname, '..', 'files'),
  ip: 'localhost',
  secretKey: process.env.SECRET_KEY || 'very-nice-dev-secret',
  port: process.env.PORT || 3000,
  development: {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'database.sqlite'
  },
  production: {
    host: process.env.HOST,
    dialect: 'sqlite',
    storage: 'database.sqlite'
  }
}
