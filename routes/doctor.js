var express = require('express');
var jwt = require('jsonwebtoken');


var middlewareAuth = require('../middlewares/autenticacion');

var app = express();
var Doctor = require("../models/doctor");


// 
// GET ALL DOCTORS
//
app.get("/", (res, res, next) => {
    Doctor.find({}, (err, doctores) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando doctores',
                errors: err
            })
        }
        return res.status(200).json({
            ok: true,
            doctores: doctores
        })
    })
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
        doctorModificado.img = body.img;


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
                hospital: hospitalGuardado
            });
        })

    })
})

// 
//  Eliminar Doctor 
//

app.delete('/:id', middlewareAuth.verificaToken, (req, res, next) => {
    var id = req.params.id;

})

//
// Crear Doctor
//


app.post('/', middlewareAuth.verificaToken, (req, res, next) => {

})