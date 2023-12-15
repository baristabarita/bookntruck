const express = require('express');
const app = express();

//Middleware to parse JSON requests
app.use(express.json());
const createBookingValidator = (req, res, next)=>{
    const{est_finish_date, delivery_address,book_price,trucker_id, client_id, container_id, payment_id} = req.body;
    const errors = {};

    if(!est_finish_date){
        errors.est_finish_date = 'Est. Date is Required!'
    }
    if(!delivery_address){
        errors.delivery_address = 'Delivery Address is required!'
    }
    
    /* WIP
    if(!book_price){
        errors.book_price = 'Booking Price needed!'
    }*/

    if(!trucker_id || typeof trucker_id !== 'number'){
        errors.trkr_id = 'Trucker Account ID is required!'
    }
    if(!client_id || typeof client_id !== 'number'){
        errors.clnt_id = 'Client Account ID is required!'
    }
    if(!container_id || typeof container_id !== 'number'){
        errors.cont_id = 'Container ID is required!'
    }

    /* WIP
    if(!pay_id || typeof pay_id !== 'number'){
        errors.pay_id = 'Payment ID is required!'
    }*/

    if (Object.keys(errors).length > 0) {
        return res.json({
            status: 404,
            success: false,
            error: errors,
        });
    }

    next();
}

module.exports = createBookingValidator;