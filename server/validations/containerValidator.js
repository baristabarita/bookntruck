const express = require('express');
const app = express();

//Middleware to parse JSON requests
app.use(express.json());

const createContainerValidator = (req, res, next)=>{
    if(!req.body.container_type){
        return res.json({
            success: false,
            error: {text: ['Container type is empty!']},
        });
    }

    if(!req.body.weight){
        return res.json({
            success: false,
            error: {text: ['Container weight is empty!']},
        });
    }

    if(!req.body.quantity){
        return res.json({
            success: false,
            error: {text: ['Container quantity is empty!']},
        });
    }

    if(!req.body.pickup_location){
        return res.json({
            success: false,
            error: {text: ['Container pickup location is empty!']},
        });
    }

    if(!req.body.item_name){
        return res.json({
            success: false,
            error: {text: ['Container Item name is empty!']},
        });
    }

    if(!req.body.item_type){
        return res.json({
            success: false,
            error: {text: ['Container Item type is empty!']},
        });
    }

    if(!req.body.item_weight){
        return res.json({
            success: false,
            error: {text: ['Container Item weight is empty!']},
        });
    }

    if(!req.body.item_quantity){
        return res.json({
            success: false,
            error: {text: ['Container Item quantity is empty!']},
        });
    }

    next();
}

const updateContainerValidator = (req, res, next)=>{
    if(!req.body.container_type){
        return res.json({
            success: false,
            error: {text: ['Container type is empty!']},
        });
    }

    if(!req.body.weight){
        return res.json({
            success: false,
            error: {text: ['Container weight is empty!']},
        });
    }

    if(!req.body.quantity){
        return res.json({
            success: false,
            error: {text: ['Container quantity is empty!']},
        });
    }

    if(!req.body.pickup_location){
        return res.json({
            success: false,
            error: {text: ['Container pickup location is empty!']},
        });
    }

    if(!req.body.item_name){
        return res.json({
            success: false,
            error: {text: ['Container Item name is empty!']},
        });
    }

    if(!req.body.item_type){
        return res.json({
            success: false,
            error: {text: ['Container Item type is empty!']},
        });
    }

    if(!req.body.item_weight){
        return res.json({
            success: false,
            error: {text: ['Container Item weight is empty!']},
        });
    }

    if(!req.body.item_quantity){
        return res.json({
            success: false,
            error: {text: ['Container Item quantity is empty!']},
        });
    }

    next();
}

module.exports = [createContainerValidator, updateContainerValidator];