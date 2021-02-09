const joi = require('joi');

const registerValidation  = (dataToValidate) => {
    const userSchema = joi.object({
        Name: joi.string().
            min(6).
            required(),
        Email: joi.string().
            email().
            required(),
        Password: joi.string().
            min(8).
            required(),
    });

    return userSchema.validate(dataToValidate);
} 

const loginValidation = (dataToValidate) => {
    const userSchema = joi.object({
        Email: joi.string().
                email().
                required(),
        Password: joi.string().
                required(),
    });
    return userSchema.validate(dataToValidate);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;






