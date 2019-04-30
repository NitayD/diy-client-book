const Inventory = require('../models/Inventory')

const newItem = async ({ number, name, mark = '' }) => {
  if (!name || !number) return false
  try {
    let item = new Inventory()
    item.number = +number
    item.name = name
    item.mark = mark
    await item.save(err => {
      if (err) { return console.log('error', err) }
    })
    return { status: true, data: item }
  } catch (err) {
    return { status: false, error: err }
  }
};

const get = async () => {
  return await Inventory.find().sort({ number: 1 })
};

const getByName = async (query) => {
  const regex = new RegExp(query, 'i');
  return await Inventory.find({ name: regex })
}

const getByMark = async (query) => {
  const regex = new RegExp(query, 'i');
  return await Inventory.find({ mark: regex })
}

const update = async ({ _id, name = false, number = false, mark = false }) => {
  const item = await Inventory.findOne({ _id: _id })
  item.number = +number ? +number : +item.number
  item.name = name ? name : item.name
  item.mark = mark ? mark : item.mark
  item.save(err => {
    if (err) { return { status: false } }
    return { status: true }
  })
};

const removeOne = async (id) => {
  try {
    const { number } = await Inventory.findOne({ _id: id })
    await Inventory.updateMany(
      { number: { $gt: number } },
      { $inc: { number: -1 } }
    )
    return { status: true, data: await Inventory.deleteOne({ _id: id }) }
  } catch (err) { return { status: false, err: err } }
};

const deleteAll = callback => {
  Inventory.deleteMany({}, (err, chatIds) => {
    if (err) { return console.log('error', err); }
    callback ? callback(chatIds) : console.log(chatIds);
  });
};

module.exports.new = newItem
module.exports.get = get
module.exports.getByName = getByName
module.exports.getByMark = getByMark
module.exports.update = update
module.exports.deleteOne = removeOne
module.exports.deleteAll = deleteAll