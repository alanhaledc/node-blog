const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/response')
const url = require('url')

const handleUserRouter = (req, res) => {
  const method = req.method
  const path = url.parse(req.url).pathname

  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        return new SuccessModel()
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }
}

module.exports = handleUserRouter
