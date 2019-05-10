const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/response')
const loginCheck = require('../middlewares/loginCheck')
const express = require('express')
const router = express.Router()

router.get('/list', (req, res) => {
  const { keyword = '' } = req.query

  let author = ''

  if (req.query.isadmin) {
    if (!req.session.username) {
      res.json(new ErrorModel('未登录'))
    }
    author = req.session.username
  }

  const result = getList(author, keyword)

  return result.then(listData => {
    res.json(new SuccessModel(listData))
  })
})

router.get('/detail', (req, res) => {
  const result = getDetail(req.query.id)
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
})

router.post('/new', loginCheck, (req, res) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
})

router.post('/update', loginCheck, (req, res) => {
  const result = updateBlog(req.query.id, req.body)
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('更新博客失败'))
    }
  })
})

router.post('/del', loginCheck, (req, res) => {
  const author = req.session.username
  const result = delBlog(req.query.id, author)
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('删除博客失败'))
    }
  })
})

module.exports = router
