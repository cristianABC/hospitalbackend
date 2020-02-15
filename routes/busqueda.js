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


//================================
// busqueda especifica
//================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var coleccion = req.params.tabla;
    var busqueda = req.params.busqueda;

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    if (coleccion == 'doctores') {
        buscarDoctores(busqueda, regex).then(doctores => {
            res.status(200).json({
                ok: true,
                [coleccion]: doctores,
                mensaje: 'Petición realizada correctamente'
            });
        })
    } else if (coleccion == 'usuarios') {
        buscarUsuarios(busqueda, regex).then(usuarios => {
            res.status(200).json({
                ok: true,
                [coleccion]: usuarios,
                mensaje: 'Petición realizada correctamente'
            });
        })
    } else if (coleccion == 'hospitales') {
        buscarHospitales(busqueda, regex).then(hospitales => {
            res.status(200).json({
                ok: true,
                [coleccion]: hospitales,
                mensaje: 'Petición realizada correctamente'
            });
        })
    } else {
        res.status(400).json({
            ok: false,
            mensaje: 'Los tipos de búsqueda son solo usuarios,doctores y hospitales',
            error: 'tipo de tabla/coleccion no es correcto'
        })
    }
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