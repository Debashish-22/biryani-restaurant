const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

const { upload } = require('../config/multerMware');
const { admin } = require('../config/passport-local-strategy');

router.get('/', admin, adminController.adminHome);

router.get('/upload-dish', admin, adminController.uploadDishPage)

router.post('/create-dish', admin, upload.single('foodImg'), adminController.createDish)

router.post('/update-order', admin, adminController.updateOrder);

module.exports  = router