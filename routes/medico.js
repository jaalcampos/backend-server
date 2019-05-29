//Requires
var express         = require('express');
var mdAutenticacion = require('../middlewares/autentificacion');

var app = express();

//Importamos el modelo Medico
var Medico = require('../models/medico');

//Obtenemos todos los medicos
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;

    desde = Number(desde);

    Medico.find().skip(desde).limit(5).populate('usuario', 'usuario email').populate('hospital').exec((err, medicos ) =>{

        if (err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargando medicos',
                errors: err
            });
        }

        Medico.count({}, (err, count) => {

            return res.status(200).json({
                ok:true,
                medicos: medicos,
                total: count
            });

        })

       
    });
});

//Creamos un medico
app.post('/',  mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoCreado) => {

        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear medico.',
                errors: err
            });
        }

        res.status(201).json({
            ok:true,
            medico: medicoCreado
        });
        
    });

});

//Actualizar medico

app.put('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id   = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al actualizar medico.',
                errors: err
            });
        }

        if(!medico){
            return res.status(400).json({
                ok:false,
                mensaje: 'No se encontro un medico con el id:'+ id,
                errors: {message: 'El id no existe'}
            });
        }

        medico.nombre    = body.nombre;
        medico.usuario   = req.usuario._id;
        medico.hospital  = body.hospital;

        medico.save((err, medicoGuardado) =>{

            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al actualizar el medico.',
                    errors: err
                });
            }

            return res.status(200).json({
                ok:true,
                medicoGuardado: medicoGuardado
            });

        });

    });

});

//Borra un medico

app.delete('/:id',mdAutenticacion.verificaToken, (req,res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if (err) {

            return res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoEliminado) {

            return res.status(400).json({
                ok:false,
                mensaje: 'No existe el medico.',
                errors: {message : 'No existe el medico.'}
            });
        } 

        return res.status(200).json({
            ok:true,
            medicolRemove: medicoEliminado

       });

    });

});

module.exports = app;

