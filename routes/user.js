const Router = require('koa-router')
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/response')

const router = new Router({ prefix: '/api/user' })

router.post('/login', async ctx => {
  const { username, password } = ctx.request.body
  const data = await login(username, password)

  if (data.username) {
    ctx.session.username = data.username
    ctx.session.realname = data.realname

    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('登录失败')
  }
})

router.get('/login-test', async ctx => {
  if (ctx.session.username) {
    ctx.body = new SuccessModel('已登录')
  }

  ctx.body = new ErrorModel('未登录')
})

router.get('/session-test', async ctx => {
  const session = ctx.session
  if (!session.num) {
    session.num = 0
  }

  session.num += 1

  ctx.body = {
    num: session.num
  }
})

module.exports = router
