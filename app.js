const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const morgan = require('koa-morgan')
const path = require('path')
const fs = require('fs')

const { REDIS_CONFIG } = require('./config/db')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

const isProd = process.env.NODE_ENV === 'production'

// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
)

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

if (!isProd) {
  app.use(
    morgan('dev', {
      stream: process.stdout
    })
  )
} else {
  const logFileName = path.resolve(__dirname, './logs/access.log')
  if (!fs.existsSync(logFileName)) {
    fs.mkdirSync(path.join(__dirname, 'logs'))
  }
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(
    morgan('combined', {
      stream: writeStream
    })
  )
}

// session
app.keys = ['sWdsi8jd#_34@']
app.use(
  session({
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    },
    store: redisStore({
      all: `${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`
    })
  })
)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
