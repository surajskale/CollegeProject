const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const authToken = req.session.token;
    if(authToken != undefined) {
        try{
            const verified_user = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
            if(verified_user){
                req.user = verified_user;
                console.log('This is veified use ' + req.user);
                next();
            }
            else{
                return res.redirect('/user/login');
            }
        }catch(err){
            req.jwt_expired = true;
            return res.redirect('/user/login');
        }
    }
    else{
        req.jwt_expired = true;
        return res.redirect('/user/login');
    }
    next();
}   

module.exports.verifyToken = verifyToken;