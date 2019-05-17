const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')

const app = express()

async function start() {
  app.use(serveStatic(path.join(__dirname, 'build')))
  return app
}


module.exports = start()