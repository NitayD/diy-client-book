const Router = require('express').Router
const ControllerClients = require('../controllers/Clients')

const router = Router();

router.get('/',async (req, res) => {
  return res.send(await ControllerClients.get());
});

router.get('/get/:query', async (req, res) => {
  return res.send(await ControllerClients.getByQuery(req.params.query));
});

router.get('/get/favorites/:query', async (req, res) => {
  return res.send(await ControllerClients.getByFavorites(req.params.query));
});

router.post('/new', async (req, res) => {
  const params = req.body
  const result = await ControllerClients.new(params)
  if (result) {
    return res.send(result);
  } else {
    return res.send({ status: false, error: 'No variables' })
  }
})

router.put('/update', async (req, res) => {
  const params = req.body
  return await res.send(ControllerClients.update(params))
})

router.delete('/delete/:mcid', async (req, res) => {
  const result = await ControllerClients.delete(req.params.mcid)
  return res.send(result)
})

module.exports = router;