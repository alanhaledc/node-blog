const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/response')
const url = require('url')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method
  const path = url.parse(req.url).pathname

  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body
    // const { username, password } = req.query
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        req.session.username = data.username
        req.session.realname = data.realname

        console.log(req.sessionId, req.session)
        // 同步到 redis
        set(req.sessionId, req.session)

        return new SuccessModel()
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }

  if (method === 'GET' && path === '/api/user/login-test') {
    console.log('req.session is', req.session)
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({ session: req.session }))
    } else {
      return Promise.resolve(new ErrorModel('尚未登录'))
    }
  }
}

module.exports = handleUserRouter
