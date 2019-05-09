const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const url = require('url')
const { SuccessModel, ErrorModel } = require('../model/response')

const loginCheck = req => {
  if (!req.session.user) {
    return Promise.resolve(new ErrorModel('尚未登录'))
  }

  // 已登录不处理，则返回 undefined
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const path = url.parse(req.url).pathname
  const { author = '', keyword = '', id } = req.query

  if (method === 'GET' && path === '/api/blog/list') {
    const result = getList(author, keyword)

    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  if (method === 'GET' && path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if (method === 'POST' && path === '/api/blog/new') {
    // 未登录抛出错误对象， 走 if 流程返回错误对象
    // 已登录返回 undefined， 不会走 if 流程
    const loginCheckResult = loginCheck(req)

    if (loginCheckResult) {
      return loginCheckResult
    }

    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if (method === 'POST' && path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)

    if (loginCheckResult) {
      return loginCheckResult
    }

    const result = updateBlog(id, req.body)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新博客失败')
      }
    })
  }

  if (method === 'POST' && path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)

    if (loginCheckResult) {
      return loginCheckResult
    }
    const author = req.session.username
    const result = delBlog(id, author)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('删除博客失败')
      }
    })
  }
}

module.exports = handleBlogRouter
