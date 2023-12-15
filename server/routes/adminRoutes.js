const express = require('express');
const router = express.Router();

const {createAdminAccount, adminUserLogin} = require('../controllers/adminController')


router.post('/adregister', createAdminAccount);
router.post('/adlogin', adminUserLogin);

module.exports = router;