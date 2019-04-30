import mongoose from 'mongoose'

import { db as dbconf } from '../../config'

mongoose.connect(`mongodb://${dbconf.login}:${dbconf.pass}@ds135036.mlab.com:35036/clientbook`)
  .then(data => console.log(data))
  .catch(error => console.warn(error))

const db = mongoose.connection

db.on('error', function (err) {
  console.error('connection error:', err.message);
});
db.once('open', function callback() {
  console.info("Connected to DB!");
});