// Requires
var express = require('express');
var mongoose = require('mongoose')

// Inicializar variables
var aap = express();

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
});

// Rutas
aap.get('/',(req, res, next) => {

    res.status(200).json({
        ok:true,
        mensaje: 'peticion realizada correctamente'
    })

})

// Escuchar peticiones
aap.listen(3000,()=> { console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online') });