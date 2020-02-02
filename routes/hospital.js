var express = require("express");
var jwt = require("jsonwebtoken");
var middlewareAuth = require('../middlewares/autenticacion');


var app = express();
var Hospital = require('../models/hospital');

//
// Cargar todos los Hospitales
//

app.get("/", (req, res, next) => {
    Hospital.find({}, function(err, hospitales) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            hospitales: hospitales
        })


    })
})

//
// Actualizar 
//

app.put("/:id", middlewareAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, buscado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!buscado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el' + id + ' no existe',
                errors: err
            });
        }
        buscado.nombre = body.nombre
        buscado.img = body.img
        buscado.usuario = req.usuario._id;

        buscado.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        })
    })
})

//
//eliminar
//

app.delete("/:id", middlewareAuth.verificaToken, (req, res, next) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, eliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
        if (!eliminado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: eliminado
        });
    })
})


//
// Crear Hospital 
// 

app.post("/", middlewareAuth.verificaToken, (req, res, next) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    })
    hospital.save((err, hospitalNuevo) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalNuevo
        });
    })


})

module.exports = app;