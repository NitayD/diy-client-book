
const ObjectId = require('mongoose').Types.ObjectId

const Clients = require('../models/Clients');
const Projects = require('../models/Projects');
const Childrens = require('../models/Childrens');
const ChildrensController = require('./Childrens')

const diff = function (a1, a2) {
  return a1.filter(i => !a2.includes(i))
    .concat(a2.filter(i => !a1.includes(i)))
}

function unique(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    obj[str] = true;
  }
  return Object.keys(obj);
}

const newClient = async ({ fio, phone, childrens = [] }) => {
  if (!fio || !phone) return { status: false, error: 'No variables' }

  let client = new Clients();
  client.fio = fio
  client.phone = phone
  client.childrens = []
  const errs = []
  const good = []
  childrens.forEach((child) => {
    let res = ChildrensController.newWithoutSave({ ...child, parentID: client._id })
    !res ? errs.push(res) : good.push(res)
  })
  if (!errs.length) {
    good.forEach(child => {
      child.save(err => {
        if (err) return console.log('error', err)
      })
      client.childrens.push(child._id)
    })
  }
  await client.save(err => {
    if (err) { return console.log('error', err) }
  });
  return { status: true, data: client }
};

const get = async () => {
  const data = await Clients.find();
  let projectIDs = []
  data.forEach(({ _doc }) => {
    projectIDs.push(..._doc.favoritesMC, ..._doc.completeMC)
  })
  projectIDs = unique(projectIDs)
  const projectsData = await Projects.find({ _id: { $in: projectIDs } })
  data.forEach(({ _doc }) => {
    _doc.favoritesMC = _doc.favoritesMC.map(mc => projectsData.find(proj => `${proj._id}` === `${mc}`))
    _doc.completeMC = _doc.completeMC.map(mc => projectsData.find(proj => `${proj._id}` === `${mc}`))
  })
  return { status: true, data }
};

const getByQuery = async (query) => {
  return await Clients.find({ fio: new RegExp(query, 'i') })
}

const getByFavorites = async (query) => {
  const data = await Clients.find({ favoritesMC: { $elemMatch: { $in: [query] } } })
  return { status: true, data: data }
}

const update = async ({ _id, fio, phone, favoriteSN, family, childrens, favoritesMC, completeMC }) => {
  try {
    const clientInBase = await Clients.findOne({ _id: _id })
    if (fio && clientInBase.fio !== fio) clientInBase.fio = fio
    if (phone && clientInBase.phone !== phone) clientInBase.phone = phone
    if (favoriteSN && diff(favoriteSN, clientInBase.favoriteSN).length > 0)
      clientInBase.favoriteSN = favoriteSN
    if (family && diff(family, clientInBase.family).length > 0)
      clientInBase.family = family
    if (childrens && diff(childrens, clientInBase.childrens).length > 0)
      clientInBase.childrens = childrens
    if (favoritesMC && diff(favoritesMC, clientInBase.favoritesMC).length > 0)
      clientInBase.favoritesMC = favoritesMC
    if (completeMC && diff(completeMC, clientInBase.completeMC).length > 0)
      clientInBase.completeMC = completeMC
    await clientInBase.save(err => {
      if (err) { return console.log('error', err) }
    })
    return { status: true, data: clientInBase }
  } catch (err) {
    return { status: false, error: err }
  }
};

const remove = async (id) => {
  try {
    const result = await Clients.deleteOne({ _id: id })
    const childrens = await Childrens.find({ parents: { $elemMatch: { $in: [id] } } })
    childrens.forEach(async (child) => {
      const newParents = child._doc.parents.filter(parentid => `${parentid}` !== `${id}`)
      child.parents = newParents
      await child.save(console.error)
    })
    return { status: true, data: result }
  } catch (err) {
    return { status: false, error: err }
  }
}

const deleteAll = callback => {
  Clients.deleteMany({}, (err, chatIds) => {
    if (err) { return console.log('error', err); }
    callback ? callback(Clients) : console.log(Clients);
  });
};

module.exports.new = newClient
module.exports.get = get
module.exports.getByFavorites = getByFavorites
module.exports.getByQuery = getByQuery
module.exports.update = update
module.exports.delete = remove
module.exports.deleteAll = deleteAll