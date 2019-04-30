const Router = require('express').Router
const ControllerChildrens = require('../controllers/Childrens')

const router = Router();

router.get('/', async (req, res) => {
  return res.send(await ControllerChildrens.get());
});

router.get('/get/:query', async (req, res) => {
  return res.send(await ControllerChildrens.getByQuery(req.params.query));
});

router.post('/new', async (req, res) => {
  const params = req.body
  const result = await ControllerChildrens.new (params)
  if (result) {
    return res.send(result);
  } else {
    return res.send('No OK, no variables')
  }
})

router.put('/update', (req, res) => {
  const params = req.body
  if (ControllerClients.update(params)) {
    return res.send('OK, updated Client');
  } else {
    return res.send('Not updated')
  }
})

router.delete('/delete/:mcid', async (req, res) => {
  const result = await ControllerChildrens.delete(req.params.mcid)
  return res.send(result)
})

module.exports = router;