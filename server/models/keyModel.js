const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = require('../models/userModel')

const keySchema = new Schema({
    username: {
        type: String,
        required: true
    },
    private_key: {
        type: String,
        required: false
    }
}, { timestamps: true })

// exportamos el modelo
module.exports = mongoose.model('Keys', keySchema);