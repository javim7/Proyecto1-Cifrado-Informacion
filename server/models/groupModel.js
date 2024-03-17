const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = require('../models/userModel')

const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [User.schema]
    },
    password: {
        type: String,
        required: false
    },
    symmetric_key: {
        type: String,
        required: false
    }
}, {timestamps: true})

// exportamos el modelo
module.exports = mongoose.model('Group', groupSchema);