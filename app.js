const url = require('url')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')

// 本地 session 数据存储
// const SESSION_DATA = {}

const getCookieExpires = (day = 1) => {
  const time = new Date()
  time.setTime(time.getTime() + day * 1000 * 60 * 60 * 24)
  return time.toGMTString()
}

// 处理 post 数据
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

  // 解析 path
  req.path = url.parse(req.url).pathname

  // 解析 query
  req.query = url.parse(req.url, true).query

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })

  // 解析 session
  // let needSetCookie = false
  // let userId = req.cookie.userid
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  // 解析 session 使用 redis
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    set(userId, {})
  }
  req.sessionId = userId
  get(req.sessionId)
    .then(sessionData => {
      console.log('sessionData', sessionData)
      if (sessionData === null) {
        set(req.sessionId, {})
        req.session = {}
      } else {
        req.session = sessionData
      }

      return processPostData(req)
    })
    .then(postData => {
      req.body = postData

      // 解析 blog 路由
      const blogResult = handleBlogRouter(req, res)

      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            res.setHeader(
              'Set-Cookie',
              `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
            )
          }
          res.end(JSON.stringify(blogData))
        })
        return
      }

      // 解析 user 路由
      const userResult = handleUserRouter(req, res)
      if (userResult) {
        userResult.then(userData => {
          if (needSetCookie) {
            res.setHeader(
              'Set-Cookie',
              `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
            )
          }
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
