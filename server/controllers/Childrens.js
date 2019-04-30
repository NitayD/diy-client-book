const Childrens = require('../models/Childrens');
const ObjectId = require('mongoose').Types.ObjectId

const newChild = async ({ fio, age, parentID }) => {
  if (!fio || !age) return { status: false, error: 'No variables' }
  try {
    let child = new Childrens();
    child.fio = fio
    child.age = age
    child.parents = parentID ? [parentID] : []
    await child.save(err => {
      if (err) { return console.log('error', err) }
    });
    return { status: true, data: child }
  } catch (err) {
    return { status: false, error: err }
  }
};

const newChildWithoutSave = ({ fio, age, parentID }) => {
  if (!fio || !age) return { status: false, error: 'No variables' }
  try {
    let child = new Childrens();
    child.fio = fio
    child.age = age
    child.parents = parentID ? [parentID] : []
    return { status: true, data: child }
  } catch (err) {
    return { status: false, error: err }
  }
};

const get = async () => {
  const data = await Childrens.find();
  return { status: true, data: data }
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
    const result = await Childrens.deleteOne({ _id: id })
    return { status: true, data: result }
  } catch (err) {
    return { status: false, error: err }
  }
};

const deleteAll = callback => {
  ChatId.deleteMany({}, (err, chatIds) => {
    if (err) { return console.log('error', err); }
    callback ? callback(chatIds) : console.log(chatIds);
  });
};

module.exports.new = newChild
module.exports.newWithoutSave = newChildWithoutSave
module.exports.get = get
module.exports.update = update
module.exports.delete = remove
module.exports.deleteAll = deleteAll