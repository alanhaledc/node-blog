const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../config/db')

const connection = mysql.createConnection(MYSQL_CONFIG)

connection.connect()

function exec(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

module.exports = { exec, escape: mysql.escape }
