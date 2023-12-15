const express = require('express');
const router = express.Router();
const [createAssetValidator, updateAssetValidator] = require('../validations/assetValidator');
const { createAsset, updateAsset, setAssetBooking, retrieveAll, retrieveByParams, retrieveByTwoParams, retrieveByThreeParams, retrieveCountByTwoParams, setAssetInvisible, deleteAsset } = require('../controllers/assetController');

router.post('/create', createAssetValidator, createAsset);
router.post('/update', updateAssetValidator, updateAsset);
router.post('/setbooking', setAssetBooking);
router.get('/retrieve', retrieveByParams);
router.get('/retrieve_all', retrieveAll);
router.get('/retrieveparams', retrieveByTwoParams);
router.get('/retrievethreeparams', retrieveByThreeParams);
router.get('/retrivecount_two', retrieveCountByTwoParams);
router.post('/set_invisible', setAssetInvisible)
router.post('/delete', deleteAsset);

module.exports = router;