const express = require('express')
const app = express()

async function start() {
  app.use(express.static('build'));
  return app
}


module.exports = start()