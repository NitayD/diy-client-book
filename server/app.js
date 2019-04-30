const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer();
const dbconf = require('./../config').db
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes/index')

mongoose.connect(`mongodb://${dbconf.login}:${dbconf.pass}@ds135036.mlab.com:35036/clientbook`, { useNewUrlParser: true })
let db = mongoose.connection

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`/api/clients`, routes.clients);
app.use(`/api/childrens`, routes.childrens);
app.use(`/api/mc`, routes.masterclasses);
app.use(`/api/projects`, routes.projects);
routes.inventory.init(app, '/api/inventory')

app.get(`/`, upload.array(), (req, res) => {
  res.send('OK')
});

app.listen(3003, function () {
  console.log(`Example app listening on port 3003!`);
});