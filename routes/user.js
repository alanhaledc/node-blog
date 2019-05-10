const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/response')
const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body

  const result = login(username, password)
  return result.then(data => {
    if (data.username) {
      req.session.username = data.username
      req.session.realname = data.realname

      res.json(new SuccessModel())
      return
    } else {
      res.json(new ErrorModel('登录失败'))
    }
  })
})

router.get('/login-test', (req, res) => {
  if (req.session.username) {
    res.json(new SuccessModel('已登录'))
  }

  res.json(new ErrorModel('未登录'))
})

router.get('/session-test', (req, res) => {
  const session = req.session
  if (!session.num) {
    session.num = 0
  }
  session.num += 1

  res.json({
    num: session.num
  })
})

module.exports = router
