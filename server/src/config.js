const path = require('path')
require('dotenv').config()

module.exports = {
  filesDir: path.join(__dirname, '..', 'files'),
  // ip: 'localhost',
  ip: '0.0.0.0',
  secretKey: process.env.SECRET_KEY || 'very-nice-dev-secret',
  port: process.env.PORT || 3000,
  development: {
    host: 'localhost',
    dialect: 'postgres',
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  },
  production: {
    // host: process.env.HOST,
    host: '0.0.0.0',
    dialect: 'postgres',
    database: process.env.DATABASE_URL,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  }
}
