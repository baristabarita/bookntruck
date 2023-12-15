const express=require('express');
const router = express.Router();

const {updateUser, retrieveAll,retrieveByParams, retrieveByTwoParams, retrieveClientTruckers, retrieveTotalCount, retrieveCountByParams, retrieveCountByUserType, retrieveRegistersThisMonth, deleteRecord}=require('../controllers/usersController')

router.post('/update', updateUser);
router.get('/retrieve',retrieveByParams);
router.get('/retrieve_all',retrieveAll);
router.get('/retrieve_twoparams', retrieveByTwoParams);
router.get('/retrieve_twousers', retrieveClientTruckers);
router.get(`/retrieve_totalcount`, retrieveTotalCount);
router.get('/retrieve_count',retrieveCountByParams);
router.get('/retrieve_typecount', retrieveCountByUserType)
router.get('/retrieve_regs_thismonth',retrieveRegistersThisMonth)
router.delete('/delete',deleteRecord);

module.exports = router;
