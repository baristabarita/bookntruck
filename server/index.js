require('dotenv').config();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

//Connecting to DB and ports
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// check for successful DB cpnnection
db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Successfully connected to the database');
      connection.release();
    }
  });

const PORT = process.env.PORT || 7000;

const app = require('./routes')

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ["GET", "POST"],
    credentials: true,
}))

app.get('/', (req,res)=>{
    res.json({
        successful: true,
        data:[1,2,3],
    });
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

module.exports = db;