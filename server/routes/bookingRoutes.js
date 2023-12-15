const express = require('express');
const router = express.Router();
const createBookingValidator = require('../validations/bookingValidator');
const {createBooking, updateBooking, retrieveAll, retrieveByParams, retrieveByTwoParams, retrieveThreeParams, retrieveCountByParams, retrieveCountByTwoParams, retrieveCountByThreeParams, retrieveTotalCount, retrieveBookingsThisMonth, completeBooking, deleteBooking, setInvisible, cancelBooking, submitFile} = require('../controllers/bookingController');

router.post('/create', createBookingValidator, createBooking);
router.post('/update', updateBooking);
router.post('/delete', deleteBooking);
router.post('/set_invisible',setInvisible);
router.post('/complete', completeBooking);
router.post('/cancel', cancelBooking);
router.post('/submit', submitFile);
router.get('/retrieve', retrieveByParams);
router.get('/retrieve_all', retrieveAll);
router.get('/retrieve_two', retrieveByTwoParams);
router.get('/retrieve_three', retrieveThreeParams);
router.get('/retrievecount', retrieveCountByParams);
router.get('/retrievecount_two', retrieveCountByTwoParams);
router.get('/retrievecount_three', retrieveCountByThreeParams);
router.get('/retrievecount_total', retrieveTotalCount);
router.get('/retrieve_bookings_this_month', retrieveBookingsThisMonth);


module.exports = router;