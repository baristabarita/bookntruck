require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const path = require('path');

//Routes for the user types of the website
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const truckerRoutes = require('./routes/truckerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');

//Routes for the features/functionalities of the website
const bookingRoutes = require('./routes/bookingRoutes');
const containerRoutes = require('./routes/containerRoutes');
const assetRoutes = require('./routes/assetRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

//W.I.P ROUTES
const forgetPassRoutes = require('./routes/forgotPassRoutes');


//Stuff for CORS

app.use(cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}); 

const allowedOrigins = [process.env.CORS_ORIGIN];
app.use(cors({
    origin: function(origin, callback){
        if(!origin || allowedOrigins.indexOf(origin) !== -1){
            callback(null,true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

//setting the app routes
app.use(express.json());
app.use('/', authenticationRoutes); //for authentication purposes
app.use('/user', userRoutes);
app.use('/client', clientRoutes);
app.use('/trucker', truckerRoutes);
app.use('/admin', adminRoutes);
app.use('/asset', assetRoutes);
app.use('/review', reviewRoutes);
app.use('/payment', paymentRoutes);
app.use('/container', containerRoutes);
app.use('/booking', bookingRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/*
app.use('/forgotPass', forgetPassRoutes);
*/
/*
app.use((req, res, next) => {
    const maxInactiveDuration = 60 * 60 * 1000; // 30 minutes in milliseconds
    const lastActivity = req.user.last_login; // Adjust this based on your user schema
  
    if (lastActivity && Date.now() - new Date(lastActivity).getTime() > maxInactiveDuration) {
      // Log the user out on the server side
      // You may want to destroy the session or handle it according to your authentication mechanism
      console.log("User session expired. Logging out.");
    }
  
    next();
  });
*/
module.exports = app;