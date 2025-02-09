const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    image: {
        type: String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    attendees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
})

module.exports = mongoose.model('Event', eventSchema);