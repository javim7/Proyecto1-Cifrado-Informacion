const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema del mensaje
const messageSchema = new Schema({
    encrypted_message: {
        type: String,
        required: true
    },
    username_origin: {
        type: String,
        required: true
    },
    username_destiny: {
        type: String,
        required: true
    }
}, {timestamps: true})

// exportamos el modelo
module.exports = mongoose.model('Message', messageSchema);