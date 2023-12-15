const express = require('express');
const app = express();

//Middleware to parse JSON requests
app.use(express.json());

const createAssetValidator = (req,res,next) => {
    if (!req.body.asset_category) {
        return res.json({
            success: false,
            error: { text: ['Asset category is empty!'] },
        });
    }
    
    if (req.body.asset_category === 'Truck') {
        if (!req.body.asset_name) {
            return res.json({
                success: false,
                error: { text: ['Truck name is empty!'] },
            });
        }

        if (!req.body.brand) {
            return res.json({
                success: false,
                error: { text: ['Brand is empty!'] },
            });
        }

        if (!req.body.type) {
            return res.json({
                success: false,
                error: { text: ['Truck type is empty!'] },
            });
        }

        if (!req.body.plate_number) {
            return res.json({
                success: false,
                error: { text: ['Plate number is empty!'] },
            });
        }
    } else if (req.body.asset_category === 'Trailer') {
        if (!req.body.type) {
            return res.json({
                success: false,
                error: { text: ['Trailer type is empty!'] },
            });
        }

        if (!req.body.measurements) {
            return res.json({
                success: false,
                error: { text: ['Measurements is empty!'] },
            });
        }

        if (!req.body.weight) {
            return res.json({
                success: false,
                error: { text: ['Weight is empty!'] },
            });
        }

        if (!req.body.plate_number) {
            return res.json({
                success: false,
                error: { text: ['Plate number is empty!'] },
            });
        }
    }

    next();
}

const updateAssetValidator = (req,res,next)=>{
    
    if (!req.body.status) {
        return res.json({
            success: false,
            error: { text: ['Asset status is empty!'] },
        });
    }
    
    if (req.body.asset_category === 'Truck') {
        if (!req.body.asset_name) {
            return res.json({
                success: false,
                error: { text: ['Truck name is empty!'] },
            });
        }

        if (!req.body.brand) {
            return res.json({
                success: false,
                error: { text: ['Brand is empty!'] },
            });
        }

        if (!req.body.type) {
            return res.json({
                success: false,
                error: { text: ['Truck type is empty!'] },
            });
        }

        if (!req.body.plate_number) {
            return res.json({
                success: false,
                error: { text: ['Plate number is empty!'] },
            });
        }
    } else if (req.body.asset_category === 'Trailer') {
        if (!req.body.type) {
            return res.json({
                success: false,
                error: { text: ['Trailer type is empty!'] },
            });
        }

        if (!req.body.measurements) {
            return res.json({
                success: false,
                error: { text: ['Measurements is empty!'] },
            });
        }

        if (!req.body.weight) {
            return res.json({
                success: false,
                error: { text: ['Weight is empty!'] },
            });
        }

        if (!req.body.plate_number) {
            return res.json({
                success: false,
                error: { text: ['Plate number is empty!'] },
            });
        }
    }
    
    next();
}

module.exports = [createAssetValidator, updateAssetValidator];
