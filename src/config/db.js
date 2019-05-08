const env = process.env.NODE_ENV

let MYSQL_CONFIG

// 开发环境数据库配置
if (env === 'development') {
  MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '3306',
    database: 'myblog'
  }
}

// 生产环境数据库配置
if (env === 'production') {
  MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '3306',
    database: 'myblog'
  }
}

module.exports = { MYSQL_CONFIG }
