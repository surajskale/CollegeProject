const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name: {
        type: 'String',
        required: true,
    },
    email: {
        type: 'String',
        required: true,
    },
    password: {
        type: 'String',
        required: true
    },
    address:{
        state: {
            type: 'String',
            required: true, 
        },
        district: {
            type: 'String',
            required: true
        },
        taluka: {
            type: 'String', 
            required: true
        },
        landmark: {
            type: 'String',
            required: true
        }
    }

})
module.exports = mongoose.model('Admin', adminSchema);
