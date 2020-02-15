var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var middlewareAuth = require('../middlewares/autenticacion');
var usuario = express();

var Usuario = require('../models/usuario');

//Obtener todos los usuarios
usuario.get('/', (req, res, next) => {
    var des = req.query.desde || 0;
    des = Number(des);
    Usuario.find({}, 'nombre correo img role').skip(des).limit(5).exec(

        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }
            Usuario.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            });

        })


});



//===========================================
//=======Actualizar Dato
//===========================================
usuario.put('/:id', middlewareAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, buscado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!buscado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: err
            });
        }

        buscado.nombre = body.nombre;
        buscado.correo = body.email;
        buscado.role = body.role;

        buscado.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        })
    });

});

//===========================================
//=======Eliminar Usuario
//===========================================

usuario.delete('/:id', middlewareAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
});
//===========================================
// Crear Usuario
//===========================================
usuario.post('/', middlewareAuth.verificaToken, (req, res) => {
    var body = req.body;

    var user = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
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
});


module.exports = usuario;