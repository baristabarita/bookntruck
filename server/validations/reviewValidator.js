const express = require('express');
const app = express();

const createReviewValidator = (req, res, next)=>{
    if(!req.body.rating){
        return res.json({
            success:false,
            error:'Review Rating is Required!'
        })
    }
    next();
}

module.exports = createReviewValidator;