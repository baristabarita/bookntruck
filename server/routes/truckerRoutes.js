const express = require('express');
const router = express.Router();
const { updateTrucker, retrieveAll, retrieveByParams, retrieveByTwoParams, retrieveByThreeParams, retrieveCountByParams, retrieveCountByTwoParams, retrieveTruckerCount, retrieveTotalCount, deactivateTrucker, deleteTrucker, harddeleteDetails } = require('../controllers/truckerController')

router.post('/update', updateTrucker);
router.get('/retrieve', retrieveByParams);
router.get('/retrievetwo', retrieveByTwoParams);
router.get('/retrievethree', retrieveByThreeParams);
router.get('/retrieve_all', retrieveAll);
router.get('/retrieve_count', retrieveCountByParams);
router.get('/retrieve_counttwo', retrieveCountByTwoParams)
router.get('/retrieve_truckers', retrieveTruckerCount);
router.get('/retrievecount_total', retrieveTotalCount);
router.post('/deactivate', deactivateTrucker);
router.post('/delete', deleteTrucker);
router.delete('/harddelete', harddeleteDetails);

module.exports = router;