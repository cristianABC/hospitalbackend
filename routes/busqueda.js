var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var Usuario = require('../models/usuario');

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarDoctores(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            doctores: respuestas[1],
            usuarios: respuestas[2],
            mensaje: 'Petición realizada correctamente'
        });
    })






});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre correo')
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error al buscar hospitales", err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarDoctores(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Doctor.find({ nombre: regex })
            .populate('usuario', 'nombre correo')
            .populate('hospital')
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error al buscar hospitales", err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre correo role').
        or([{ 'nombre': regex }, { 'correo': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject("Error al cargar usuarios", err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}
module.exports = app;