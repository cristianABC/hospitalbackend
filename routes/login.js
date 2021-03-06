var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var SEED = require('../config/config').SEED;
var app = express();
var Usuario = require('../models/usuario');


app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({ correo: body.correo }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }
        if (!usuarioDB) {
            console.log("NO USUARIO DB");
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            console.log(body.password, usuarioDB.password);
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }
        //crear token
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
            Mensaje: 'Login ok'
        });
    });
});

module.exports = app;