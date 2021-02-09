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
});

module.exports = mongoose.model('Appointments', appointmentSchema)