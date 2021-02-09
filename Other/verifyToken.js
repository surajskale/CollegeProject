const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const authToken = req.session.token;
    if(authToken == undefined){
        return res.render('loginPage', {Title: 'Login', role:'user'}); // This doesn't display 'You are logged out message'.
    }
    if(authToken != undefined) {
        try{
            const verified_user = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
            if(verified_user){
                req.id = verified_user.id;
                next();
            }
            else{
                req.id = 'loggedout';
            }
        }catch(err){
            req.id = 'loggedout';
        }
    }
    else{
        req.id = 'loggedout';
    }
    next();
}   

module.exports.verifyToken = verifyToken;