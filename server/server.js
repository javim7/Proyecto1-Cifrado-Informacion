require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/users')

// aplicacion de express
const app = express()
const cors = require('cors')

// middleware
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// rutas
app.use('/users', userRoutes)

// conectar a la base de datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // escuchar requests
        port = process.env.PORT
        app.listen(port, () => {
            console.log(`Conectado a la base de datos & escuchando en el puerto ${port}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })