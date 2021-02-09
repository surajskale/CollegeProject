const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
require('./models/Admin');
app.set('views', path.join(__dirname + '/views'));
dotenv.config();

// importing models
require('./models/User');

// setting database 
mongoose.connect(process.env.DB_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database');
}).catch(err =>
    console.log('Error connecting to database \n' + err)
);

// setting engine 
app.use(expressLayouts);
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}));

// setting routes 
app.get('/', (req, res) => {res.redirect('/user/login')} );
app.use('/user/', require('./routes/userRouter'));
app.use('/admin/', require('./routes/adminRouter'));
const Admin = mongoose.model('Admin');
app.get('/temp', (req, res) => {
    const newAdmin = new Admin;
    newAdmin.name = 'Suarez';
    newAdmin.email = 'suarez@gmail.com',
    newAdmin.password = 'suarez@gmail.com',
    newAdmin.address.state = 'mh';
    newAdmin.address.district = 'os';
    newAdmin.address.taluka = 'os';
    newAdmin.address.landmark = 'nthng';
    try{
        newAdmin.save();
    }catch(e){
        console.log(e);
    }
    res.render('appointments');
})

PORT = process.env.PORT || 777;
app.listen(PORT, console.log(`Server started on ${PORT}\n  localhost:${PORT}`));
