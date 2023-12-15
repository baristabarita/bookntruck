const express = require('express');
const app = express();

const createPaymentValidator = (req,res,next)=>{
    const { total_balance } = req.body;

    const errors = {};

    if (!total_balance || typeof total_balance !== 'number') {
        errors.balance = ['Balance is required and must be a number'];
    }

    if (Object.keys(errors).length > 0) {
        return res.json({
            status: 404,
            success: false,
            error: errors,
        });
    }

    next();
}

module.exports = createPaymentValidator;