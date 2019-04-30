const mongoose = require('mongoose');
const Schema = mongoose.Schema

const clientsSchema = mongoose.Schema({
  fio: String,
  phone: String,
  family: [Schema.Types.ObjectId],
  childrens: [Schema.Types.ObjectId],
  favoritesMC: [Schema.Types.ObjectId],
  completeMC: [Schema.Types.ObjectId],
  favoriteSN: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Clients = module.exports = mongoose.model('clients', clientsSchema);

module.exports.get = function (callback, limit) {
  Clients.find(callback).limit(limit);
}