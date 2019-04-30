const mongoose = require('mongoose');
const Schema = mongoose.Schema

const childrensSchema = mongoose.Schema({
  fio: String,
  age: Number,
  parents: [Schema.Types.ObjectId],
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Childrens = module.exports = mongoose.model('childrens', childrensSchema);

module.exports.get = function (callback, limit) {
  Childrens.find(callback).limit(limit);
}