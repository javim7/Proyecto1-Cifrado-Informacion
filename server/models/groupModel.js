const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = require('../models/userModel')

const groupSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    usuarios: {
        type: [User.schema]
    },
    contraseña: {
        type: String,
        required: false
    },
    clave_simetrica: {
        type: String,
        required: false
    }
}, {timestamps: true})

// exportamos el modelo
module.exports = mongoose.model('Group', groupSchema);