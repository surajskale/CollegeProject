const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const authToken = req.session.token;
    console.log(authToken);
    if(authToken == undefined){
        req.id = 'loggedout';
        next();
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
}   

module.exports.verifyToken = verifyToken;