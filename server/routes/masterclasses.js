const Router = require('express').Router
const ControllerMasterClasses = require('../controllers/MasterClasses')

const router = Router();

router.get('/', async (req, res) => {
  return res.send(await ControllerMasterClasses.get());
})

router.get('/old', async (req, res) => {
  return res.send(await ControllerMasterClasses.getOld());
})

router.get('/all', async (req, res) => {
  return res.send(await ControllerMasterClasses.getAll());
})

router.get('/get/:mcid', async (req, res) => {
  return res.send(await ControllerMasterClasses.getOne(req.params.mcid));
});

router.post('/new', async (req, res) => {
  const params = req.body
  const result = await ControllerMasterClasses.new(params)
  if (result) {
    return res.send(result);
  } else {
    return res.send('No OK, no variables')
  }
})

router.put('/update', async (req, res) => {
  const params = req.body
  const result = await ControllerMasterClasses.update(params)
  return res.send(result)
})

router.delete('/delete/:mcid', async (req, res) => {
  const result = await ControllerMasterClasses.delete(req.params.mcid)
  return res.send(result)
})

module.exports = router;