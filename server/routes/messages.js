const express = require('express')
const Message = require('../models/messageModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const router = express.Router()

/**
 * GET /messages
 */
// obtener todos los mensajes entre dos usuarios
router.get('/users/:username_origen/:username_destino', async (req, res) => {
    const { username_origen, username_destino } = req.params;

    try {
        // revisar si los dos usuarios existen
        const originUser = await User.findOne({ username: username_origen });
        const destinyUser = await User.findOne({ username: username_destino });

        if (!originUser || !destinyUser) {
            return res.status(400).json({ error: 'One or both usernames do not exist' });
        }

        const messages = await Message.find({
            $or: [
                { username_origen, username_destino },
                { username_origen: username_destino, username_destino: username_origen }
            ]
        }).sort({ createdAt: 'asc' }); 

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

/**
 * POST /messages
 */
// enviar un mensaje a un usuario destino
router.post('/:username_destino', async (req, res) => {
    const { username_destino } = req.params;
    const { message, username_origen } = req.body;
    
    try {
        // revisar si los dos usuarios existen
        const originUser = await User.findOne({ username: username_origen });
        const destinyUser = await User.findOne({ username: username_destino });

        if (!originUser || !destinyUser) {
            return res.status(400).json({ error: 'Uno o ninguno de los usuarios existe.' });
        }

        // crear el mensaje si los dos usuarios existen
        const messagee = new Message({ message, username_origen, username_destino });
        await messagee.save();
        res.status(201).json(messagee);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})  

module.exports = router;