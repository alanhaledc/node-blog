const Router = require('koa-router')
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/response')
const loginCheck = require('../middlewares/loginCheck')
const router = new Router({ prefix: '/api/blog' })

// 使用 async / await 语法
router.get('/list', async ctx => {
  const { keyword = '' } = ctx.query

  let author
  if (ctx.query.isadmin) {
    author = ctx.session.username
  }

  const listData = await getList(author, keyword)

  ctx.body = new SuccessModel(listData)
})

router.get('/detail', async ctx => {
  const detailData = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(detailData)
})

router.post('/new', loginCheck, async ctx => {
  ctx.request.body.author = ctx.session.username
  const data = await newBlog(ctx.request.body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async ctx => {
  const data = updateBlog(ctx.query.id, ctx.request.body)
  ctx.body = data ? new SuccessModel() : new ErrorModel('更新博客失败')
})

router.post('/del', loginCheck, async ctx => {
  const author = ctx.session.username
  const data = await delBlog(ctx.query.id, author)
  ctx.body = data ? new SuccessModel() : new ErrorModel('删除博客失败')
})

module.exports = router
