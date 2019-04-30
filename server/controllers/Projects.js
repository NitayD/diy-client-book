const Projects = require('../models/Projects');
const Clients = require('../models/Clients');

const newProject = async ({ name, imageLink = '' }) => {
  if (!name) return false
  try {
    let project = new Projects();
    project.name = name
    project.imageLink = imageLink
    await project.save(err => {
      if (err) { return console.log('error', err) }
    });
    return project
  } catch (err) {
    return err
  }
};

const get = async () => {
  return await Projects.find();
};

const getWithFavorites = async () => {
  let projects = await Projects.find();
  const projIDs = projects.map(item => item._doc._id)
  const clients = await Clients.find({ favoritesMC: { $elemMatch: { $in: projIDs } } })
  return { projects, clients }
};

const update = (client, callback) => {
  const flrt = ['fio', 'phone', 'family', 'childrens', 'favoritesMC', 'completeMC', 'favoriteSN']
  ChatId.findOne({ _id: client._id }, (err, clientInBase) => {
    if (err) { return console.log('error', err); }
    if (!clientInBase) { return callback ? callback(`Не найдено: ${chatIds}`) : console.log(`Не найдено: ${chatIds}`) }

    const attrs = Object.keys(client).filter(elem => !!flrt.find(item => item === elem))
    attrs.forEach(attr => {
      if (Array.isArray(clientInBase[attr]))
        clientInBase[attr] = diff(clientInBase[attr], client[attr]).length > 0 ? client[attr] : clientInBase[attr]
      else
        clientInBase[attr] = clientInBase[attr] !== client[attr] ? client[attr] : clientInBase[attr]
    })

    clientInBase.save(err => {
      if (err) { return console.log('error', err) }
      callback
        ? callback(`*${clientInBase.fio}*, данные были обновленны`)
        : console.log(`*${clientInBase.fio}*, данные были обновленны`)
    });
  })
};

const remove = async (id) => {
  try {
    const result = await Projects.deleteOne({ _id: id })
    return { status: true, data: result }
  } catch (err) {
    return { status: false, error: err }
  }
};

const deleteAll = async (callback) => {
  ChatId.deleteMany({}, (err, chatIds) => {
    if (err) { return console.log('error', err); }
    callback ? callback(chatIds) : console.log(chatIds);
  });
};

module.exports.new = newProject
module.exports.get = get
module.exports.getWithFavorites = getWithFavorites
module.exports.update = update
module.exports.delete = remove
module.exports.deleteAll = deleteAll
