const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
router.use(express.urlencoded({extended: false}));
const adminController = require('../controllers/adminController');
const {verifyTokenAdmin }= require('../Other/verifyTokenAdmin');
const Appointment = mongoose.model('Appointment');
const Admin = mongoose.model('Admin');
const cookieSession = require('cookie-session');
router.use(cookieSession({secret: process.env.COOKIE_SECRET_KEY} ));

router.get('/', (req, res) => {
    res.redirect('/admin/login');
});

router.get('/appointments', verifyTokenAdmin, async (req, res) => {
    try{
        const admin_id = req.admin_id;
        console.log(admin_id);
        const used_appointments = await Appointment.find({admin_id: admin_id}).select('-_id -__v');
        const admin = await Admin.findOne({_id: admin_id});
        console.log(used_appointments);
        res.render('appointmentsAdmin', {Title: 'Appointments', 
        start_time : admin.start_time,
        used_appointments: used_appointments});
    }catch(e){
        console.log(e);
        res.send('System error. Please try after some time');
    }
});

router.get('/login', verifyTokenAdmin , adminController.loginGet);

router.post('/login', adminController.loginPost);

router.get('/register', verifyTokenAdmin, adminController.registerGet);

router.post('/register', adminController.registerPost);
router.get('/get', (req, res) => {
    console.log(req.session.token);
    console.log(req.session.admin_token);
    res.send('a');
})
module.exports = router;


