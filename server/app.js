const express = require('express')
const path = require('path')
const app = express()

async function start() {
  app.use('/', express.static(path.resolve(__dirname, 'build')));
  console.log(app)
  return app
}


module.exports = start()