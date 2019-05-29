// Requires
var express = require('express');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autentificacion');

var app = express();

// Importamos modelo de usuario
var Usuario = require('../models/usuario');

// Rutas

// Obtener todos los usuarios.
app.get('/',(req, res, next) => {

    var desde = req.query.desde || 0;

    desde = Number(desde);

    Usuario.find({},'nombre email img role').skip(desde).limit(5).exec(
    (err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'Error cargando usuarios.',
                    errors: err
                });
            }

            Usuario.count({}, (err, count) => {

                res.status(200).json({
                    ok:true,
                    usuarios: usuarios,
                    total: count
                });

            });

          

    });

}); 

// Actualizar datos.
app.put('/:id', mdAutenticacion.verificaToken , (req, res) => {

    var id   = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario ) => {

         if(err){
             return res.status(500).json({
                 ok:false,
                 mensaje: 'Error al buscar usuario.',
                 errors: err
             });
         }

         if (!usuario){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error el usuario con el id: '+ id + ' no existe.',
                errors: {message: 'El usuario no existe.'}
            });
         }

    usuario.nombre = body.nombre;
    usuario.email  = body.email;
    usuario.role   = body.role;
    
    usuario.save((err,usuarioGuardado) => {

        if (err){

            return res.status(400).json({
                ok:false,
                mensaje: 'Error al actualizar usuario.',
                errors: err

            });
        }

        return res.status(200).json({
                ok:true,
                usuario: usuarioGuardado
            });

        });

    });

});

// Crear un nuevo usuario.
app.post('/', mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error creando usuario.',
                errors: err
            });
        }

        res.status(201).json({
            ok:true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });

});

//Borrar un usuario
app.delete('/:id', mdAutenticacion.verificaToken ,(req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioRemove) => {

        if (err) {

            return res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioRemove) {

            return res.status(400).json({
                ok:false,
                mensaje: 'No existe el usuario.',
                errors: {message : 'No existe el usuario.'}
            });
        }

        return res.status(200).json({
             ok:true,
             usuario: usuarioRemove

        });

    });

});

module.exports = app;