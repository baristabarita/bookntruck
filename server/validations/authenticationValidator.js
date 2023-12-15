const express = require('express');
const app = express();

//Middleware to parse JSON requests
app.use(express.json());

const clientAuthenticationValidator = (req, res, next) => {
  const errors = [];
  console.log(req.body.password);
  if (!req.body.client_name || req.body.client_name.length < 5) {
    errors.push('Username must be at least 5 characters long!');
  }

  if (!req.body.email_address) {
    errors.push('Email is required!');
  }

  if (!req.body.password) {
    errors.push('Password is required!');
  } else {
    if (!/(?=.*[a-z])/.test(req.body.password)) {
      errors.push('Password must contain at least one lowercase letter!');
    }
    if (!/(?=.*[A-Z])/.test(req.body.password)) {
      errors.push('Password must contain at least one uppercase letter!');
    }
    if (req.body.password.length < 8) {
      errors.push('Password must be at least 8 characters long!');
    }
  }

  if (!req.body.contact_number) {
    errors.push('Contact number is required!');
  }
  console.log(errors)

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors,
      errorType: 'validation',
    });
  }

  next();
};



const clientLoginValidator = (req, res, next) => {
    let error = "";
    if(!req.body.email_address){
        error = 'Email is Required!'
    }
    if(!req.body.password){
        error = 'Password is required!'
    }
    if (error !== '') {
      return res.status(404).json({
        success: false,
        message: error,
      });
    }
    next();
}

const truckerAuthenticationValidator = (req, res, next) => {
    let error = "";

    if(!req.body.trucker_name || req.body.trucker_name.length < 5){
        error = 'User name is invalid!'
    }

    if(!req.body.email_address){
        error = 'Email is required!'
    }

    if(!req.body.business_name || req.body.business_name.length < 5){
        error = 'Invalid Business Name'
    }

    if(!req.body.position || req.body.position.length < 4){
        error = 'Invalid Position'
    }

    if (!req.body.password) {
        error = 'Password is required!';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(req.body.password)) {
        error = 'Password must contain at least one lowercase and one uppercase letter!';
      } else if (req.body.password.length < 8) {
        error = 'Password is too short';
      }

    if(!req.body.contact_number){
        error = 'Contact number is empty'
    }

    if(error !== '') {
        return res.json({
            status: 404,
            success: false,
            error: error,
        });
    }
    next();

}

const truckerLoginValidator = (req, res, next) => {
    let error = "";
    if(!req.body.email_address){
        error = 'Email is Required!'
    }
    if(!req.body.password){
        error = 'Password is required!'
    }
    if(error !== ''){
        return res.json({
            status: 404,
            success: false,
            error: error,
        });
    }
    next();
}
module.exports = [clientAuthenticationValidator, clientLoginValidator, truckerAuthenticationValidator, truckerLoginValidator];