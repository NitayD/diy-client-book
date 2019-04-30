const mongoose = require('mongoose');
const Schema = mongoose.Schema

const MCSchema = mongoose.Schema({
  project: Schema.Types.ObjectId,
  date: Date,
  price: Number,
  maxMembers: Number,
  members: [
    {
      parent: Schema.Types.ObjectId,
      child: Schema.Types.ObjectId,
      pay: {
        method: {
          type: String,
          default: ''
        },
        status: {
          type: Boolean,
          default: false
        }
      },
      create_date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Clients = module.exports = mongoose.model('masterclasses', MCSchema);

module.exports.get = function (callback, limit) {
  Clients.find(callback).limit(limit);
}