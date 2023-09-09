const express = require('express');
const router = express.Router();

const customerController = require ('../controllers/customerController');

router.get('/', customerController.list);
router.post('/add', customerController.save);
router.get('/delete/:idcustom', customerController.delete);

router.get('/update/:idcustom', customerController.edit);
router.post('/update/:idcustom', customerController.update);

module.exports = router;