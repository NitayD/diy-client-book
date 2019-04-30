const Router = require('express').Router
const ControllerProjects = require('../controllers/Projects')

const router = Router();

router.get('/', async (req, res) => {
  return res.send(await ControllerProjects.get());
});
router.get('/with_favorites', async (req, res) => {
  return res.send(await ControllerProjects.getWithFavorites());
}); 

router.post('/new', async (req, res) => {
  const params = req.body
  const result = await ControllerProjects.new(params)
  if (result) {
    return res.send(result);
  } else {
    return res.send('No OK, no variables')
  }
})

router.put('/update', (req, res) => {
  const params = req.body
  if (ControllerProjects.update(params)) {
    return res.send('OK, updated Client');
  } else {
    return res.send('Not updated')
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    res.send(await ControllerProjects.delete(req.params.id))
  } catch (err) {
    res.send({ status: false, error: err })
  }
})

module.exports = router;