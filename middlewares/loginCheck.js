const { ErrorModel } = require('../model/response')

module.exports = async (ctx, next) => {
  if (ctx.session.username) {
    await next()
  } else {
    ctx.body = new ErrorModel('未登录')
  }
}
