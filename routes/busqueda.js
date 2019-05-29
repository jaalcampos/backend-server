// Requires
var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico   = require('../models/medico');
var Usuario  = require('../models/usuario');

//Busqueda por coleccion
app.get('/coleccion/:table/:value', (req, res) => {

     var table    = req.params.table;
     var busqueda = req.params.value;
     var regex    = new RegExp(busqueda, 'i');

     var promesa;

     switch(table){

        case 'usuarios': 
            
             promesa = buscarUsuarios(busqueda, regex);
             break;
            
        case 'hospitales': 

             promesa = buscarHospitales(busqueda, regex);
             break;
             
        case 'medicos':

             promesa = buscarMedicos(busqueda, regex);
             break;
      
        default:

                res.status(400).json({
                    ok:false,
                    mensaje: 'Los tipo de busqueda solo son: usuarios, medicos y hospitales.',
                    error: {message: 'tipo de tabla/coleccion no valido.'}
                });

     }

     promesa.then(resultado => {

        res.status(200).json({
            ok:true,
            mensaje: 'peticion realizada correctamente',
            /*corchetes sirven para poner el valor de la variable table */
            [table]: resultado
        });

     });

});


// Busqueda por todo
app.get('/todo/:busqueda',(req, res, next) => {

    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i');

    Promise.all([
                buscarHospitales(busqueda,regex),
                buscarMedicos(busqueda, regex),
                buscarUsuarios(busqueda,regex)]).then(respuestas => {

                    res.status(200).json({
                        ok:true,
                        hospitales: respuestas[0],
                        medicos: respuestas[1],
                        usuarios: respuestas[2]
                    });

                });

    /*buscarHospitales(busqueda, regex).then(hospitales => {

        res.status(200).json({
                        ok:true,
                        mensaje: 'peticion realizada correctamente',
                        hospitales: hospitales
                    });

         });*/

});

function buscarHospitales(busqueda, regex){

    return new Promise((resolve, reject) => {

        Hospital.find({nombre:regex}).populate('usuario', 'nombre email').exec((err, hospitales) => {

            if(err){
                reject('Error al cargar hospitales', err);
            }else{
                resolve(hospitales);
            }
    
        });

    });

}

function buscarMedicos(busqueda, regex){

    return new Promise((resolve, reject) => {

        Medico.find({nombre:regex}).populate('usuario', 'nombre email').populate('hospital').exec((err, medicos) => {

            if(err){
                reject('Error al cargar medicos', err);
            }else{
                resolve(medicos);
            }
    
        });

    });

}

function buscarUsuarios(busqueda, regex){

    return new Promise((resolve, reject) => {

        Usuario.find({},'nombre email role').or([{'nombre':regex}, {'email': regex}]).exec((err, usuarios) => {

            if (err){
                reject('Error al cargar los usuarios', err);
            }else {
                resolve(usuarios);
            }

        });

    });

}

module.exports = app;