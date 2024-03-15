const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema del usuario
// dejamos el ID fuera ya que es algo que mongo genera automaticamente
const userSchema = new Schema({
    public_key: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

// exportamos el modelo
module.exports = mongoose.model('User', userSchema);
