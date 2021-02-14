const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const verifyTokenAdmin = async (req, res, next) => {
    const authToken = req.session.admin_token;
    console.log('authToken', authToken);
    if(authToken == undefined){
        req.admin_id = 'loggedout';
        next();
    }
    if(authToken != undefined) {
        try{
            const verified_admin = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
            // check whether such admin exists
            const result = await Admin.find({_id: verified_admin.id}).select('_id');
            // console.log(result);
            if(result){
                req.admin_id = verified_admin.id;
                next();
            }
            else{
                req.session.token = '';
                req.admin_id = 'loggedout';
            }
        }catch(err){
            req.session.token = '';
            req.admin_id = 'loggedout';
        }
    }
    else{
        req.session.token = '';
        req.admin_id = 'loggedout';
    }
}   

module.exports.verifyTokenAdmin = verifyTokenAdmin;