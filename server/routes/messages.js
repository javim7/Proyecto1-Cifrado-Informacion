const express = require('express')
const Message = require('../models/messageModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const router = express.Router()

/**
 * GET /messages
 */
// obtener todos los mensajes entre dos usuarios
router.get('/:username_origin/users/:username_destiny', async (req, res) => {
    const { username_origin, username_destiny } = req.params;

    try {
        // Check if both username_origin and username_destiny exist in the Users collection
        const originUser = await User.findOne({ username: username_origin });
        const destinyUser = await User.findOne({ username: username_destiny });

        if (!originUser || !destinyUser) {
            return res.status(400).json({ error: 'One or both usernames do not exist' });
        }

        // Both usernames exist, retrieve all messages between them
        const messages = await Message.find({
            $or: [
                { username_origin, username_destiny },
                { username_origin: username_destiny, username_destiny: username_origin }
            ]
        }).sort({ createdAt: 'asc' }); // Adjust sorting as per your requirement

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
router.post('/:username_destiny', async (req, res) => {
    const { username_destiny } = req.params;
    const { encrypted_message, username_origin } = req.body;
    
    try {
        // revisar si los dos usuarios existen
        const originUser = await User.findOne({ username: username_origin });
        const destinyUser = await User.findOne({ username: username_destiny });
        console.log('originUser:', originUser, 'destiny', destinyUser)

        if (!originUser || !destinyUser) {
            return res.status(400).json({ error: 'One or both usernames do not exist' });
        }

        // crear el mensaje si los dos usuarios existen
        const message = new Message({ encrypted_message, username_origin, username_destiny });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})  

module.exports = router;