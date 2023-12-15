const express = require('express');
const router = express.Router();
const createReviewValidator = require('../validations/reviewValidator');
const {createReview, retrieveAll, retrieveByParams, retrieveCountByParams, retrieveAverage} = require('../controllers/reviewController');

router.post('/create', createReviewValidator, createReview);
router.get('/retrieve', retrieveByParams);
router.get('/retrieve_all', retrieveAll);
router.get('/retrieve_count',retrieveCountByParams);
router.get('/retrieve_avg', retrieveAverage);

module.exports = router;