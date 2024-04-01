const express = require('express')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const router = express.Router()

/**
 * GET /users
 */
// obtener todos los usuarios
router.get('/', async (req, res) => {
    const users = await User.find({}).sort({ date_created: -1 })
    res.status(200).json(users)
})

// obtener un usuario especifico por su nombre de usuario
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// obtener la llave publica del usuario en base 64 por su nombre de usuario
router.get('/:username/key', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const publicKey = user.public_key;
        const publicKeyBase64 = Buffer.from(publicKey).toString('base64');

        res.status(200).json({ publicKeyBase64 });
    } catch (error) {
        console.error('Error retrieving user key:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * POST /users
 */
// crear un usuario
router.post('/', async (req, res) => {
    const { username, public_key } = req.body

    try {
        const user = await User.create({ public_key, username })
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

/**
 * PATCH /users
 */
//actualiza la llave publica de un usuario
router.patch('/:username', async (req, res) => {
    // const { username } = req.params;
    const { username, public_key } = req.body;

    try {
        // Find and update the user by username
        const user = await User.findOneAndUpdate(
            { username },
            { public_key },
            { new: true }
        );

        // Check if the user exists
        if (user) {
            // If user exists, send success response with updated user
            res.status(200).json({ message: 'Llave actualizada correctamente', user });
        } else {
            // If user not found, send 404 response
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        // If any error occurs, send 500 response with error message
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * DELETE /users
 */
// Eliminar un usuario por su nombre de usuario
router.delete('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Find and delete the user by username
        const user = await User.findOneAndDelete({ username });

        // Check if the user exists
        if (user) {
            // If user exists, send success response
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } else {
            // If user not found, send 404 response
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        // If any error occurs, send 500 response with error message
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar la llave de un usuario por su nombre de usuario
router.delete('/key/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Find and update the user by username to remove the public key
        const user = await User.findOneAndUpdate(
            { username },
            { public_key: '' },
            { new: true }
        );

        // Check if the user exists
        if (user) {
            // If user exists, send success response
            res.status(200).json({ message: 'Llave eliminada correctamente' });
        } else {
            // If user not found, send 404 response
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        // If any error occurs, send 500 response with error message
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router