const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const url = require('url')
const { SuccessModel, ErrorModel } = require('../model/response')

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
    req.body.author = 'bill'
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if (method === 'POST' && path === '/api/blog/update') {
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
    const author = 'bill'
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
