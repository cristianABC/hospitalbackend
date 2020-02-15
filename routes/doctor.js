var express = require('express');
var jwt = require('jsonwebtoken');


var middlewareAuth = require('../middlewares/autenticacion');

var app = express();
var Doctor = require("../models/doctor");


// 
// GET ALL DOCTORS
//
app.get("/", (req, res, next) => {
    var des = req.query.desde || 0;
    des = Number(des);

    Doctor.find({}, (err, doctores) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando doctores',
                    errors: err
                })
            }
            Doctor.count({}, (err, conteo) => {

                return res.status(200).json({
                    ok: true,
                    doctores: doctores,
                    total: conteo
                })
            })
        }).populate("usuario", "nombre correo")
        .populate("hospital").skip(des).limit(5)
});


//
// Actualizar Doctor 
//
app.put("/:id", middlewareAuth.verificaToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;
    Doctor.findById(id, (err, doctorModificado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar doctor',
                errors: err
            });
        }
        if (!doctorModificado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El doctor con el' + id + 'no existe',
                errors: err
            });
        }

        doctorModificado.nombre = body.nombre;
        doctorModificado.usuario = req.usuario._id;
        doctorModificado.hospital = body.hospital;


        doctorModificado.save((err, doctorGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar doctor',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                doctor: doctorGuardado
            });
        })

    })
})

// 
//  Eliminar Doctor 
//

app.delete("/:id", middlewareAuth.verificaToken, (req, res, next) => {
    var id = req.params.id;
    Doctor.findByIdAndRemove(id, (err, eliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar doctor',
                errors: err
            });
        }
        if (!eliminado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe Doctor con ese id',
                errors: { message: 'No existe un Doctor con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            doctor: eliminado
        });
    })
})


//
// Crear Doctor
//



app.post("/", middlewareAuth.verificaToken, (req, res, next) => {
    var body = req.body;
    var doctor = new Doctor({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    })
    doctor.save((err, doctorNuevo) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear doctor',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            doctor: doctorNuevo
        });
    })


})
module.exports = app;