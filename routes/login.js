var express = require('express');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');

var SEED    = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

//Librerias google
var CLIENT_ID        = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(CLIENT_ID);


//Autentificacion Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        igm: payload.picture,
        google: true
    }

  }
  verify().catch(console.error);

app.post('/google', async (req, res) => {

    var token      = req.body.token;
    var googleUser = await verify(token).catch(e => {

        res.status(403).json({
            ok:false,
            mensaje:'Token no valido'
        });

    });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {

            if (err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al buscar usuario.',
                    errors: err
                });
            }

            if(usuarioDB){

                if(usuarioDB.google === false){

                    return res.status(400).json({
                        ok:false,
                        mensaje:'Debe usar su autentificacion normal.'
                    });

                }else{

                    var token = jwt.sign({usuario: usuarioBD}, SEED, {expiresIn: 14400});

                    res.status(200).json({
                        ok:true,
                        usuario: usuarioBD,
                        token: token,
                        id: usuarioBD._id
                    });

                }

            }else{
            //Usuario no existe hay que crearlo.

                var usuario = new Usuario();

                usuario.nombre = googleUser.nombre;
                usuario.email  = googleUser.email;
                usuario.igm    = googleUser.igm;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((err, userGuardado) => {

                        if(err){
                            return res.status(500).json({
                                ok:false,
                                mensaje: 'Error creando usuario.',
                                errors: err
                            });
                        }

                        var token = jwt.sign({usuario: userGuardado}, SEED, {expiresIn: 14400});

                        res.status(200).json({
                            ok:true,
                            usuario: userGuardado,
                            token: token,
                            id: userGuardado._id
                        });

                });


            }

    });
    
 
});

//Autentificacion normal
app.post('/', (req,res) => {

    var body = req.body;

    Usuario.findOne({email : body.email}, (err, usuarioBD) => {

        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar usuario.',
                errors: err
            });
        }

        if (!usuarioBD){
            return res.status(400).json({
                ok:false,
            
                mensaje:'Credenciales incorrectas. -email'
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)){
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas. -password'
            });
        }

        usuarioBD.password = ':)';

        var token = jwt.sign({usuario: usuarioBD}, SEED, {expiresIn: 14400})

        res.status(200).json({
            ok:true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });

    });

});

module.exports = app;