//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();
// Serve Index config
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads')); */

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
// Importar Rutas 
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var HospitalRoutes = require('./routes/hospital');
var DoctorRoutes = require('./routes/doctor');
var BusquedaRoutes = require('./routes/busqueda');
var CargaRoutes = require('./routes/upload');
var ImagenesRoutes = require('./routes/imagenes');
//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/Hospital', (err, res) => {
    if (err) throw err;
    console.log('BD corriendo: \x1b[32m%s\x1b[0m', 'online')
})

// Rutas
app.use("/hospital", HospitalRoutes);
app.use('/doctor', DoctorRoutes);
app.use('/usuario', userRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', BusquedaRoutes);
app.use('/carga', CargaRoutes);
app.use('/imagenes', ImagenesRoutes);
app.use('/', appRoutes);


//Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})