/**
 * @fileoverview Centralized place to declare the main Express app and
 * Sequelize db variables so that circular references are
 * avoided when loading models.js, router.js and app.js
 */

// Initialize express app
const express = require('express')
const app = express()

// Initialize database using Sequelize
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('./config')[env]
const Sequelize = require('sequelize')
let db = null

// if (env === 'development') {
//   db = new Sequelize(
//     dbConfig.database,
//     dbConfig.username,
//     dbConfig.password,
//     dbConfig)
// } else {
//   db = new Sequelize(process.env.DATABASE_URL, {
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       }
//     }
//   })
// }

db = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

// Wipes database if `force: true`
db.sync({
  force: false
})
console.log(
  `> sequelize: using ${dbConfig.dialect} for ${env} environment`)
module.exports = {
  app,
  db
}
