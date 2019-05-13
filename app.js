// Requires
var express = require('express');
var mongoose = require('mongoose')
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Importar Rutas
var appRoute = require('./routes/app');
var usuarioRoute = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
});

// Routas
app.use('/usuario',usuarioRoute);
app.use('/login',loginRoutes);
app.use('/',appRoute);


// Escuchar peticiones
app.listen(3000,()=> { console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online') });