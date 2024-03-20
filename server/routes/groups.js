const express = require('express')
const Group = require('../models/groupModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const router = express.Router()

/**
 * GET /groups
 */
// obtener todos los grupos
router.get('/', async (req, res) => {
    const groups = await Group.find({}).sort({createdAt: -1})
    //retornar todos los campos excepto contrasena
    groups.forEach(group => {
        group.contraseña = undefined;
    });

    res.status(200).json(groups)
})

/**
 * POST /groups
 */
// crear un grupo
router.post('/', async (req, res) => {
    const { nombre, clave_simetrica, usuarios, contraseña  } = req.body;

    try {
        const userList = [];

        for (const username of usuarios) {
            const user = await User.findOne({ username });

            
            if (user) {
                userList.push(user);
            } else {
                console.log(`User with username '${username}' not found. Skipping.`);
            }
        }

        const newGroup = new Group({
            nombre,
            usuarios: userList,
            contraseña,
            clave_simetrica
        });

        const savedGroup = await newGroup.save();

        res.status(201).json(savedGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PATCH /groups/:name
 */
// actualizar un grupo anadiendo un usuario
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const group = await Group.findById(id);

        if (group) {
            const user = await User.findOne({ username });

            if (user) {
                group.usuarios.push(user);
                const updatedGroup = await group.save();
                res.status(200).json(updatedGroup);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (error) {
        console.error('Error adding user to group:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


/**
 * DELETE /groups/:name
 */
// eliminar un grupo
router.delete('/:nombre', async (req, res) => {
    const { nombre } = req.params;

    try {
        // Find and delete the group by its name
        const group = await Group.findOneAndDelete({ nombre });

        // Check if the group exists
        if (group) {
            // If group exists, send success response
            res.status(200).json(group);
        } else {
            // If group not found, send 404 response
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (error) {
        // If any error occurs, send 500 response with error message
        console.error('Error deleting group:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router