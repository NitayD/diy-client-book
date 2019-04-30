const MasterClasses = require('../models/MasterClasses')
const Projects = require('../models/Projects')
const Clients = require('../models/Clients')
const Childrens = require('../models/Childrens')
const ClientsController = require('./Clients')

const newMC = async ({ project, date, price, maxMembers }) => {
  if (
    !project||
    !date ||
    !price && Number(price) === Number(price) ||
    !maxMembers && Number(maxMembers) === Number(maxMembers)
  ) return false
  try {
    let mc = new MasterClasses();
    mc.project = project
    mc.date = date
    mc.price = price
    mc.maxMembers = maxMembers
    await mc.save(err => {
      if (err) { return console.log('error', err) }
    });
    return mc
  } catch (err) {
    return err
  }
};

const get = async () => {
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  const data = await MasterClasses.find({
    date: {
      $gte: today
    }
  })
  const result = []
  for (let i = 0; i < data.length; i++) {
    const element = { ...data[i]._doc }
    element.project = await Projects.findOne({ _id: element.project })
    result.push(element)
  }
  return { status: true, data: result }
};

const getOld = async () => {
  try {
    const today = new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0))
    const data = await MasterClasses.find({
      date: {
        $lte: today
      }
    })
    const result = []
    for (let i = 0; i < data.length; i++) {
      const element = { ...data[i]._doc }
      try {
        const projData = await Projects.findOne({ _id: element.project })
        element.project = projData ? projData : { empty: true, name: 'Проект удалён, или не существует' }
      } catch (err) {
        element.project = { empty: true, name: 'Проект удалён, или не существует' }
      }
      result.push(element)
    }
    return { status: true, data: result }
  } catch (error) {
    console.error(error)
    return { status: false, error: error }
  }
};

const getAll = async () => {
  const data = await MasterClasses.find()
  const result = []
  for (let i = 0; i < data.length; i++) {
    const element = { ...data[i]._doc }
    element.project = await Projects.findOne({ _id: element.project })
    result.push(element)
  }
  return { status: true, data: result }
};

const getOne = async (id) => {
  try {
    const data = await MasterClasses.findOne({ _id: id })
    const element = { ...data._doc }
    const proj = await Projects.findOne({ _id: element.project })
    element.project = proj ? proj : { empty: true, name: 'Проект удалён, или не существует', _id: '000000000000000000000000' }
    for (let i = 0; i < element.members.length; i++) {
      const member = element.members[i]
      let parent = await Clients.findOne({ _id: member.parent })
      let child = await Childrens.findOne({ _id: member.child })
      if (!parent) parent = { _doc: { empty: true, fio: 'Взрослый удалён, или не существует' } }
      if (!child) child = { _doc: { empty: true, fio: 'Ребёнок удалён, или не существует' } }
      element.members[i] = { ...member._doc, parent: parent._doc, child: child._doc }
    }
    const favorites = await ClientsController.getByFavorites(element.project._id)
    return { status: true, data: element, favorites }
  } catch (error) {
    console.log(error)
    return { status: false, error: error }
  }
};

const update = async (newMCdata) => {
  try {
    const mc = await MasterClasses.findOne({ _id: newMCdata.id })
    if (!mc) return { status: false, error: 'No MC by id' }
    const { members, maxMembers, price, date, project } = newMCdata
    if (members) {
      mc.members = members
      const parentIDs = []
      const childIDs = []
      members.forEach(async (member) => {
        parentIDs.push(member.parent)
        childIDs.push(member.child)
      })
      try {
        const parentFromDB = await Clients.find({ _id: { $in: parentIDs } })
        const childFromDB = await Childrens.find({ _id: { $in: childIDs } })
        members.forEach(async (member) => {
          const par = parentFromDB.find(item=>`${item._doc._id}` === `${member.parent}`)
          const chi = childFromDB.find(item=>`${item._doc._id}` === `${member.child}`)
          if (!par.childrens.map(it => `${it}`).includes(`${par._doc._id}`)) {
            par.childrens = [...par._doc.childrens, chi._doc._id]
            await par.save(err => console.error(err))
          }
          if (!chi.parents.map(it => `${it}`).includes(`${par._doc._id}`)) {
            chi.parents = [...chi._doc.parents, par._doc._id]
            await chi.save(err => console.error(err))
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
    if (maxMembers) mc.maxMembers = maxMembers
    if (price) mc.price = price
    if (date) mc.date = date
    if (project) mc.project = project
    await mc.save(err => console.error(err))

    return { status: true, data: mc }
  } catch (error) {
    return { status: false, data: error }
  }
}

const remove = async (id) => {
  try {
    const result = await MasterClasses.deleteOne({ _id: id })
    return { status: true, data: result }
  } catch (err) {
    return { status: false, error: err }
  }
};

const deleteAll = () => {
  // MasterClasses.deleteMany({}, (err, chatIds) => {
  //   if (err) { return console.log('error', err); }
  //   callback ? callback(chatIds) : console.log(chatIds);
  // });
};

module.exports.new = newMC
module.exports.get = get
module.exports.getOld = getOld
module.exports.getAll = getAll
module.exports.getOne = getOne
module.exports.update = update
module.exports.delete = remove
module.exports.deleteAll = deleteAll