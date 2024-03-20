const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = require('../models/userModel')

const groupMessageSchema = new Schema({
    group_id: {
        type: Schema.Types.ObjectId,
        required: true
    },  
    autor: {
        type: User.schema,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true})

// exportamos el modelo
module.exports = mongoose.model('Group_Message', groupMessageSchema);