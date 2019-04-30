const Router = require('../router')
const ControllerInventory = require('../controllers/Inventory')

const router = new Router()

router.set('get', '/', async (req, res) => {
  return res.send(await ControllerInventory.get());
});

router.set('get', '/get/name/:name', async (req, res) => {
  return res.send(await ControllerInventory.getByName(req.params.name));
});

router.set('get', '/get/mark/:mark', async (req, res) => {
  return res.send(await ControllerInventory.getByMark(req.params.mark));
});

router.set('post', '/new', async (req, res) => {
  const params = req.body
  const result = await ControllerInventory.new(params)
  if (result) {
    return res.send(result);
  } else {
    return res.send('No OK, no variables')
  }
})

router.set('put', '/update', (req, res) => {
  const params = req.body
  return res.send({ status: ControllerInventory.update(params) })
})

router.set('delete', '/delete/:id', async (req, res) => {
  const params = req.body
  return res.send(await ControllerInventory.deleteOne(req.params.id))
})

module.exports = router;