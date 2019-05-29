// Requires
var express    = require('express');
var fileUpload = require('express-fileupload');
var fs         = require('fs');

var app = express();

var Hospital = require('../models/hospital');
var Medico   = require('../models/medico');
var Usuario  = require('../models/usuario');

// default options
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id',(req, res, next) => {

    //Recupero parametros de url
    var tipo = req.params.tipo;
    var id   = req.params.id;

    //Tipos de coleccion.
    var coleccionesValidas = ['hospitales', 'medicos', 'usuarios'];

    if( coleccionesValidas.indexOf(tipo) < 0 ){

        res.status(400).json({
            ok:false,
            mensaje: 'Collecion no permitida.',
            error: {message: 'Las colecciones permitidas son: '+ coleccionesValidas.join(', ') }
        });

    }

    if (!req.files){

        res.status(400).json({
            ok:false,
            mensaje: 'Debe seleccionar un archivo.',
            error: {message: 'No se detecto archivo.'}
        });

    }

    //Obtener nombre del archivo
    var archivo          = req.files.imagen;
    var nombreCortado    = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    //Extensiones validas
    var extensionesValidas = ['jpg', 'png', 'gif', 'jepg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0 ){

        res.status(400).json({
            ok:false,
            mensaje: 'Formato no permitido.',
            error: {message: 'Los formatos permitidos son: '+ extensionesValidas.join(', ') }
        });

    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path 
    var path = `./upload/${tipo}/${nombreArchivo}`

    archivo.mv(path, err => {

        if (err){
            
            res.status(500).json({
                ok:false,
                mensaje: 'Error al mover archivo.',
                error: {message: err }
            });
        }

        subirPorTipo(tipo,id,nombreArchivo,res);
        /*   res.status(200).json({
            ok:true,
            mensaje: 'Imagen actualizada con exito.',
            usuario: usuarioActualizado
         });*/

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res){

    if (tipo === 'usuarios'){

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

       var pathViejo = './upload/usuarios/'+ usuario.img;

       //Si existe, elimina la imagen anterior.
       if (fs.existsSync(pathViejo)){
           fs.unlinkSync(pathViejo);
       }
   
       usuario.img = nombreArchivo;
       
       usuario.save((err,usuarioActualizado) => {
   
           if (err){
   
               return res.status(400).json({
                   ok:false,
                   mensaje: 'Error al actualizar usuario.',
                   errors: err
   
               });
           }
   
           return res.status(200).json({
                   ok:true,
                   usuario: usuarioActualizado
               });
   
           });
   
       });

    }

    if (tipo === 'medicos'){

        Medico.findById(id, (err, medico ) => {

            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje: 'Error al buscar medico.',
                    errors: err
                });
            }
   
            if (!medico){
               return res.status(400).json({
                   ok:false,
                   mensaje: 'Error el medico con el id: '+ id + ' no existe.',
                   errors: {message: 'El medico no existe.'}
               });
            }

       var pathViejo = './upload/medicos/'+ medico.img;

       //Si existe, elimina la imagen anterior.
       if (fs.existsSync(pathViejo)){
           fs.unlinkSync(pathViejo);
       }
   
       medico.img = nombreArchivo;
       
       medico.save((err,medicoActualizado) => {
   
           if (err){
   
               return res.status(400).json({
                   ok:false,
                   mensaje: 'Error al actualizar medico.',
                   errors: err
   
               });
           }
   
           return res.status(200).json({
                   ok:true,
                   usuario: medicoActualizado
               });
   
           });
   
       });

    }

    if (tipo === 'hospitales'){

        Hospital.findById(id, (err, hospital ) => {

            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje: 'Error al buscar hospital.',
                    errors: err
                });
            }
   
            if (!hospital){
               return res.status(400).json({
                   ok:false,
                   mensaje: 'Error el hospital con el id: '+ id + ' no existe.',
                   errors: {message: 'El hospital no existe.'}
               });
            }

       var pathViejo = './upload/hospitales/'+ hospital.img;

       //Si existe, elimina la imagen anterior.
       if (fs.existsSync(pathViejo)){
           fs.unlinkSync(pathViejo);
       }
   
       hospital.img = nombreArchivo;
       
       hospital.save((err,hospitalActualizado) => {
   
           if (err){
   
               return res.status(400).json({
                   ok:false,
                   mensaje: 'Error al actualizar hospital.',
                   errors: err
   
               });
           }
   
           return res.status(200).json({
                   ok:true,
                   usuario: hospitalActualizado
               });
   
           });
   
       });

    }

}

module.exports = app;