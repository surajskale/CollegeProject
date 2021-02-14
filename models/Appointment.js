const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    user_id: {
        type: 'String',
        required: true,
    },
    admin_id: {
        type: 'String',
        required: true,
    },
    start_time: {
        type: 'number', 
        required: true
    },
    end_time: {
        type: 'number', 
        required: true
    }, 
    status: {
        type: 'boolean',
        required: true
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema)