//requires
var express = require('express');
var mongoose = require('mongoose');


//Inicializar variables
var app = express();

//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/Hospital', (err, res) => {
    if (err) throw err;
    console.log('BD corriendo: \x1b[32m%s\x1b[0m', 'online')
})

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });

});




//Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})