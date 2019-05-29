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
var appRoute       = require('./routes/app');
var usuarioRoute   = require('./routes/usuario');
var loginRoutes    = require('./routes/login');
var medicoRoute    = require('./routes/medico');
var hospitalRoutes = require('./routes/hospital');
var busquedaRoute  = require('./routes/busqueda');
var uploadRoute    = require('./routes/upload');
var imagenesRoute  = require('./routes/imagenes');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
});

//Server Index Config
/*var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));*/

// Routas
app.use('/usuario',usuarioRoute);
app.use('/login',loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico',medicoRoute);
app.use('/busqueda', busquedaRoute);
app.use('/upload', uploadRoute);
app.use('/imagenes', imagenesRoute);
app.use('/',appRoute);


// Escuchar peticiones
app.listen(3000,()=> { console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online') });