var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
app.use(fileUpload());

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');



app.put('/:coleccion/:id', (req, res, next) => {
    var coleccion = req.params.coleccion;
    var id = req.params.id;

    //tipos de coleccion 
    var tiposValidos = ['hospitales', 'doctores', 'usuarios'];

    if (tiposValidos.indexOf(coleccion) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es valida',
            errors: { message: 'Tipo de colección no es valida' }
        })
    }

    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó un archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        })
    }

    //Obtener nombre archivoud
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son' + extensionesValidas.join(', ') }
        })
    }

    // Cambiar nombre de archivo
    var nombreArchivo = id + "-" + new Date().getMilliseconds() + '.' + extension;
    // Mover archivo a la ruta
    var path = 'uploads/' + coleccion + '/' + nombreArchivo;
    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            })
        }
    });

    subirPorTipo(coleccion, id, nombreArchivo, res);




});


function subirPorTipo(coleccion, id, nombreArchivo, res) {
    if (coleccion == 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: err
                });
            } else if (usuario == null) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: err
                });
            } else {

                var rutaVieja = "uploads/usuarios/" + usuario.img;
                if (fs.existsSync(rutaVieja)) {
                    fs.unlink(rutaVieja, (err, response) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'Error sobreescribiendo archivo',
                                errors: err
                            });
                        }
                    });
                }
                usuario.img = nombreArchivo;

            }

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ';)';
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizando la BD',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            })
        });
    }
    if (coleccion == 'doctores') {
        Doctor.findById(id, (err, doctor) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error buscando doctor',
                    errors: err
                });
            }
            if (doctor == null) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'El doctor no existe',
                    errors: err
                });
            }

            var rutaVieja = "uploads/doctores/" + doctor.img;
            if (fs.existsSync(rutaVieja)) {
                fs.unlink(rutaVieja, (err, response) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error sobreescribiendo archivo',
                            errors: err
                        });
                    }
                });
            }
            doctor.img = nombreArchivo;


            doctor.save((err, doctorActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizando el doctor',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de doctor actualizada',
                    doctor: doctorActualizado
                });
            })
        });

    }
    if (coleccion == 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital no existe',
                    errors: err
                });
            } else if (hospital == null) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'El hospital no existe',
                    errors: err
                });
            } else {
                var rutaVieja = "uploads/hospitales/" + hospital.img;
                if (fs.existsSync(rutaVieja)) {
                    fs.unlink(rutaVieja, (err, response) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'Error sobreescribiendo archivo',
                                errors: err
                            });
                        }
                    });
                }
                hospital.img = nombreArchivo;
            }
            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizando el hospital',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de doctor hospital',
                    doctor: hospitalActualizado
                });
            })
        });
    }
}
module.exports = app;