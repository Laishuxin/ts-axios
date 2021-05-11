const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const router = express.Router()
const cookieParser = require('cookie-parser')
const multipart = require('connect-multiparty')
const path = require('path')
const atob = require('atob')

require('./server2')

const app = express()
const compiler = webpack(WebpackConfig)
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false,
    },
  })
)

app.use(
  multipart({
    uploadDir: path.resolve(__dirname, 'upload-file'),
  })
)

app.use(webpackHotMiddleware(compiler))
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(router)
app.use(
  express.static(__dirname, {
    setHeaders(res) {
      res.cookie('XSRF-TOKEN-D', '1234abc')
    },
  })
)

// testing cases
router.get('/simple/get', function (req, res) {
  res.json({
    msg: `hello world`,
  })
})

router.get('/base/get', function (req, res) {
  res.json(req.query)
})

router.post('/base/post', function (req, res) {
  res.json(req.body)
})

router.post('/base/buffer', function (req, res) {
  let msg = []
  req.on('data', (chunk) => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.get('/error/get', function (req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`,
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function (req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`,
    })
  }, 3000)
})

router.all('/extend/:method', function (req, res) {
  const method = req.params['method']
  if (method !== 'user') {
    res.json({
      method: req.params['method'],
    })
  } else {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        username: 'foo',
        age: 18,
      },
    })
  }
})

router.get('/interceptor/get', function (req, res) {
  res.end('hello')
})

router.all('/config/post', function (req, res) {
  res.json({
    code: 0,
    message: 'ok',
    result: {
      username: 'foo',
      age: 18,
    },
  })
})

router.get('/cancel/token', function (req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`,
    })
  }, 3000)
})

router.get('/more/get', function (req, res) {
  console.log(req.cookies)
  res.json(req.cookies)
})

router.post('/more/upload', function (req, res) {
  console.log(req.body, req.files)
  res.end('upload success!')
})

router.post('/more/post', function (req, res) {
  const auth = req.headers.authorization
  const [type, credentials] = auth.split(' ')
  console.log(atob(credentials))
  const [username, password] = atob(credentials).split(':')
  if (type === 'Basic' && username === 'Yee' && password === '123456') {
    res.json(req.body)
  } else {
    res.end('UnAuthorization')
  }
})

router.get('/more/:a', function (req, res) {
  res.status(304)
  res.end()
})



const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
