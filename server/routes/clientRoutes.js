const express = require('express');
const router = express.Router();
const { updateDetails, retrieveAll, retrieveByParams, retrieveCountByParams, retrieveClientCount, deactivateClient, deleteClient, harddeleteDetails } = require('../controllers/clientController')

router.post('/update', updateDetails);
router.get('/retrieve', retrieveByParams);
router.get('/retrieve_all', retrieveAll);
router.get('/retrieve_count', retrieveCountByParams);
router.get('/retrieve_clients', retrieveClientCount);
router.post('/deactivate', deactivateClient);
router.post('/delete', deleteClient);
router.delete('/harddelete', harddeleteDetails);

module.exports = router;