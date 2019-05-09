const env = process.env.NODE_ENV

let MYSQL_CONFIG
let REDIS_CONFIG

// 开发环境数据库配置
if (env === 'development') {
  MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '3306',
    database: 'myblog'
  }

  REDIS_CONFIG = {
    port: 6379,
    host: '127.0.0.1'
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

  REDIS_CONFIG = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = { MYSQL_CONFIG, REDIS_CONFIG }
