const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Keys = require('../models/keyModel');

/**
 * GET /:username
 */
// obtener la llave privada de la tabla keys si el usuario existe
router.get('/:username', async (req, res) => {

    const { username } = req.params;

    try {
        // revisar si el usuario existe
        const user = await User.findOne({
            username: username
        });

        if (!user) {

            return res.status(400).json({
                error: 'El nombre de usuario no existe'
            });

        }

        const key = await Keys.findOne({
            username: username
        });

        if (!key) {

            return res.status(400).json({
                error: 'No se ha encontrado la llave privada'
            });

        }

        res.status(200).json(key);

    } catch (error) {

        console.error('Error fetching key:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });

    }

});

/**
 * POST /
 */
// Colocamos la private key en la tabla keys si el usuario existe
router.post('/', async (req, res) => {

    const { username, private_key } = req.body;

    try {

        // revisar si el usuario existe

        const user = await User.findOne({
            username: username
        });

        if (!user) {

            return res.status(400).json({
                error: 'El nombre de usuario no existe'
            });

        }

        const key = new Keys({
            username,
            private_key
        });

        await key.save();

        res.status(200).json(key);

    } catch (error) {

        console.error('Error saving key:', error);

        res.status(500).json({
            error: 'Error interno del servidor al guardar la clave privada'
        });

    }

});


module.exports = router;