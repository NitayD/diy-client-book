const mongoose = require('mongoose');
const Schema = mongoose.Schema

const projectsSchema = mongoose.Schema({
  name: String,
  imageLink: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Projects = module.exports = mongoose.model('projects', projectsSchema);

module.exports.get = function (callback, limit) {
  Projects.find(callback).limit(limit);
}