var express = require('express');
var usuario = express();
var Usuario = require('../models/usuario');

//Obtener todos los usuarios
usuario.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec(

        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });

        })


});

// Crear Usuario
usuario.post('/', (req, res) => {
    var body = req.body;

    var user = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        password: body.password,
        img: body.img,
        role: body.role
    });
    user.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    })
})

module.exports = usuario;