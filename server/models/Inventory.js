const mongoose = require('mongoose');
const Schema = mongoose.Schema

const inventorySchema = mongoose.Schema({
  number: Number,
  name: String,
  mark: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Inventory = module.exports = mongoose.model('inventory', inventorySchema);

module.exports.get = function (callback, limit) {
  Inventory.find(callback).limit(limit);
}