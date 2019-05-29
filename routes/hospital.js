//Requires
var express         = require('express');
var mdAutenticacion = require('../middlewares/autentificacion');


var app = express();

//Importamos el modelo Hospital
var Hospital = require('../models/hospital');

//Obtener todos los hospitales
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;

    desde = Number(desde);

    Hospital.find({}).skip(desde).limit(5).populate('usuario', 'nombre email').exec((err, hospitales) => {

        if (err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargando hospitales',
                errors: err
            });
        }

        Hospital.count({}, (err, count) => {

                return res.status(200).json({
                ok:true,
                hospitales: hospitales,
                total: count
            });

        });

    });

});

//Actualizar hospital
app.put('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id   = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al actualizar hospital.',
                errors: err
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok:false,
                mensaje: 'No se encontro un hospital con el id:'+ id,
                errors: {message: 'El id no existe'}
            });
        }

        hospital.nombre  = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) =>{

            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al actualizar el hospital.',
                    errors: err
                });
            }

            return res.status(200).json({
                ok:true,
                hospitalGuardado: hospitalGuardado
            });

        });

    });

});

//Crear un hostpital

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalCreado) => {

        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear el hospital.',
                errors: err
            });
        }

        res.status(201).json({
            ok:true,
            hospital: hospitalCreado
        });
        
    });

});

//Borrar Hospital

app.delete('/:id',mdAutenticacion.verificaToken, (req,res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {

        if (err) {

            return res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalEliminado) {

            return res.status(400).json({
                ok:false,
                mensaje: 'No existe el hospital.',
                errors: {message : 'No existe el hospital.'}
            });
        } 

        return res.status(200).json({
            ok:true,
            hospitalRemove: hospitalEliminado

       });

    });

});

module.exports = app;