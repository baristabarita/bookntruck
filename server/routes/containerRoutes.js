const express = require('express');
const router = express.Router();

const [createContainerValidator, updateContainerValidator] = require('../validations/containerValidator');
const { createContainer, updateContainer, retrieveAll, retrieveByParams, retrieveByTwoParams, deleteContainer} = require('../controllers/containerController');

router.post('/create', createContainerValidator, createContainer);
router.post('/update', updateContainerValidator, updateContainer);
router.get('/retrieve', retrieveByParams);
router.get('/retrieve_all', retrieveAll);
router.get('/retrieveparams', retrieveByTwoParams);
router.post('/delete', deleteContainer);

module.exports = router;