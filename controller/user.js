const { exec, escape } = require('../db/mysql')
const { genPwd } = require('../utils/crypto')

const login = async (username, password) => {
  // 密码加密
  password = genPwd(password)

  // escape 通过转义特殊符号 防止 sql 注入攻击
  // 转移后就是字符串了，不需要在加引号 ‘’
  username = escape(username)
  password = escape(password)

  const sql = `select username, realname from users where username = ${username} and password = ${password}`

  const rows = await exec(sql)

  return rows[0] || {}
}

module.exports = {
  login
}
