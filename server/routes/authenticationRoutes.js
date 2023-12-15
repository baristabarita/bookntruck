const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const [clientAuthenticationValidator, clientLoginValidator, truckerAuthenticationValidator, truckerLoginValidator] = require('../validations/authenticationValidator')
const {createClientAccount, createTruckerAccount, clientUserLogin, truckerUserLogin} = require('../controllers/authenticationController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // The directory where files will be stored
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });
  
  const upload = multer({ storage: storage });

router.post('/usregister', clientAuthenticationValidator, createClientAccount);
router.post('/usrlogin', clientLoginValidator, clientUserLogin);
router.post('/trkregister', upload.single('emp_proof'), truckerAuthenticationValidator, createTruckerAccount);
router.post('/trkrlogin', truckerLoginValidator, truckerUserLogin);

module.exports = router;