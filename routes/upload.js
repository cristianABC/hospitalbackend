var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();
app.use(fileUpload());



app.put('/', (req, res, next) => {
    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó un archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        })
    }

    //Obtener nombre archivo
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
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente',
        extension: extension
    });

});
module.exports = app;