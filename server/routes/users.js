const express = require('express')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const router = express.Router()

/**
 * GET /users
 */
// obtener todos los usuarios
router.get('/', async (req, res) => {
    const users = await User.find({}).sort({date_created: -1})
    res.status(200).json(users)
})

// obtener un ususario especifico
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID invalido' });
    }

    try {
        const user = await User.findById(id);
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

// obtener la llave publica del usuario en base 64
router.get('/:id/key', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID invalido' });
    }

    try {

        const user = await User.findById(id);
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
    const {public_key, username} = req.body

    try {
        const user = await User.create({public_key, username})
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

/**
 * PATCH /users
 */
//actualiza la llave publica de un usuario
router.patch('/:id/key', async (req, res) => {
    const { id } = req.params;
    const { public_key } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID invalido' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, { public_key }, { new: true });
        if (user) {
            res.status(200).json({ mssg: 'Llave actualizada correctamente', user });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * DELETE /users
 */
// eliminar un usuario
router.delete('/:id', async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID invalido' });
    }

    try {
        const user = await User.findByIdAndDelete(id)
        if (user) {
            res.status(200).json({mssg: 'Usuario eliminado correctamente'})
        } else {
            res.status(404).json({error: 'Usuario no encontrado'})
        } 
    }catch (error) {
        res.status(500).json({error: error.message})
    }
})

//elimina la llave de un ususario
router.delete('/:id/key', async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID invalido' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, {public_key: ''}, {new: true})
        if (user) {
            res.status(200).json({mssg: 'Llave eliminada correctamente'})
        } else {
            res.status(404).json({error: 'Usuario no encontrado'})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router