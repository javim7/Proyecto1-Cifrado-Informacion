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


/**
 * GET /key_pair/:username
 */
// Obtener tanto la llave privada como la llave pública de un usuario, la llave privada se en la tabla Keys y la llave pública es una propiedad
// de la tabla User

router.get('/key_pair/:username', async (req, res) => {

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


        // Si el usuario existe entonces buscamos la llave privada en la tabla Keys

        const private_key = await Keys.findOne({
            username: username
        });

        if (!private_key) {

            return res.status(400).json({
                error: 'No se ha encontrado la llave privada'
            });

        }

        console.log("User:", user);

        console.log("Lave publica:", user.public_key);

        console.log("Llave privada:", private_key);

        res.status(200).json({
            llave_publica: user.public_key,
            llave_privada: private_key.private_key
        });

    } catch (error) {

        console.error('Error fetching key pair:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });

    }

});

/**
 * GET /private_key/:username
 */
// Obtener la llave privada de un usuario, la llave privada se ecneuntra en la tabla Keys

router.get('/private_key/:username', async (req, res) => {

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

        const private_key = await Keys.findOne({

            username: username

        });

        if (!private_key) {

            return res.status(400).json({

                error: 'No se ha encontrado la llave privada'

            });

        }

        res.status(200).json(private_key.private_key);

    } catch (error) {

        console.error('Error fetching private key:', error);

        res.status(500).json({

            error: 'Error interno del servidor'

        });

    }

});

/**
 * GET /public_key/:username
 */
// Obtener la llave pública de un usuario, la llave pública se encuentra en la tabla User

router.get('/public_key/:username', async (req, res) => {

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

        res.status(200).json(user.public_key);

    } catch (error) {

        console.error('Error fetching public key:', error);

        res.status(500).json({

            error: 'Error interno del servidor'

        });

    }

});

module.exports = router;