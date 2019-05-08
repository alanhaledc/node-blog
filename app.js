const url = require('url')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const processPostData = req => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }

    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = ''

    req.on('data', chunk => (postData += chunk))

    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
}

const serverHandle = (req, res) => {
  res.setHeader('Content-type', 'application/json')

  req.path = url.parse(req.url).pathname
  req.query = url.parse(req.url, true).query

  processPostData(req).then(postData => {
    req.body = postData

    const blogResult = handleBlogRouter(req, res)

    if (blogResult) {
      blogResult.then(blogData => {
        res.end(JSON.stringify(blogData))
      })
      return
    }

    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        res.end(JSON.stringify(userData))
      })
      return
    }

    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.write('404 Not Found\n')
    res.end()
  })
}

module.exports = serverHandle
