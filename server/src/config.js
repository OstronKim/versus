const path = require('path')

module.exports = {
  'development': {
    'username': 'postgres',
    'password': 'postgres',
    'database': 'versus',
    'host': 'localhost',
    'port': 5432,
    'dialect': 'postgres'
  },
  'production': {
    'username': '',
    'password': '',
    'database': '',
    'host': '',
    'port': 5432,
    'dialect': 'postgres'
  },
  's3': {
    'id': '',
    'secret': '',
    'region': '',
    'bucket': ''
  },
  filesDir: path.join(__dirname, '..', 'files')
}