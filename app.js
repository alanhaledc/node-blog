var createError = require('http-errors')
var express = require('express')
var path = require('path')
const fs = require('fs')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = require('./db/redis')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var blogsRouter = require('./routes/blogs')
var userRouter = require('./routes/user')

const isProd = process.env.NODE_ENV === 'production'

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// 写日志
if (!isProd) {
  app.use(logger('dev'), {
    stream: process.stdout
  })
} else {
  const logFileName = path.resolve(__dirname, './logs/access.log')
  if (!fs.existsSync(logFileName)) {
    fs.mkdirSync(path.join(__dirname, 'logs'))
  }
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(
    logger('combined', {
      stream: writeStream
    })
  )
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: 'sWdsi8jd#_34@',
    resave: false, // false 不重复保存
    saveUninitialized: false, // false 不保存未初始化的值，登录后才保存 session
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
    store: new RedisStore({
      client: redisClient
    })
  })
)

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api/blog', blogsRouter)
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
