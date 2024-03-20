const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema del mensaje
const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    username_origen: {
        type: String,
        required: true
    },
    username_destino: {
        type: String,
        required: true
    }
}, {timestamps: true})

// exportamos el modelo
module.exports = mongoose.model('Message', messageSchema);