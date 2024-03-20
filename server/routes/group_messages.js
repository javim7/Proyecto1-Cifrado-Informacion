const express = require('express')
const group_Message = require('../models/groupMessageModel')
const Group = require('../models/groupModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const router = express.Router()

/**
 * GET /messages/groups/:id
 */
// obtener todos los mensajes de un grupo
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID invalido' });
    }

    try {
        const group_Messages = await group_Message.find({ group_id: id }).sort({ createdAt: 'asc'});
        res.status(200).json(group_Messages);
    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /messages/groups
 */
// crear un mensaje de grupo
router.post('/:nombre', async (req, res) => {
    const { message, autor } = req.body;
    const { nombre } = req.params;

    try {
        const user = await User.findOne({ username: autor });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // console.log(user)
        const group = await Group.findOne({ nombre });
        
        // verificar si el user es parte del grupo
        if (!group.usuarios.includes(user._id)) {
            return res.status(400).json({ error: 'El usuario no es parte del grupo' });
        }

        if (!group) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }

        const newMessage = new group_Message({
            group_id: group._id,
            autor: user,
            message
        });

        const savedMessage = await newMessage.save();

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Error creating group message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router