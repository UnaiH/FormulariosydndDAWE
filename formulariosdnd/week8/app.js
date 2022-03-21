var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware para el parseo de req.body
app.use(bodyParser.urlencoded( {extended: false}));
app.use(bodyParser.json());

var multer  = require('multer');

var storage = multer.diskStorage({
    destination: './public/imgs',
    limits:{
        fileSize: 2*1024*1024
    },
    fileFilter: (req,file,cb)=>{
        if(file.mimetype=="image/png" || file.mimetype == "image/jpg"){
            cb(null,true);
        }
        else{
            cb(null,false);
            return cb(new Error('Solo .png y .jpg'))
        }
    },
    filename:(req,file,cb)=>{
        cb(null,path.extname(file.originalname));
    }
    // definir restricciones para que los ficheros subidos se guarden en la carpeta public/imgs/
	// tamaño máximo de los ficheros: 2MB
	// sólo se admiten ficheros jpg o png
    // el nombre del fichero que se guarda debe coincidir con el que se envíab

});

var upload = multer({ storage: storage });

var pedido = upload.array('fileselect');

app.post('/pedido/add', (req, res) => {
    // en caso de error, devolver un objeto JSON
    // { sucess:false, error: err  }  
    pedido(req,res,(err)=>{
        if(err){
            let errJSON = {
            success: false,
            error: err,
            }
            return errJSON;
        }
        else{
            let exito = {
                success: true,
                files: req.body.storege,
                values: {
                    Nombre: req.body.nombre,
                    Telefono: req.body.tlf,
                    Email: req.body.email,
                    Libro: req.body.lib,
                    Cantidad: req.body.cantidad
                },
            };
            return exito;
        }
    // en caso de éxito, devolver un objeto JSON que contenga: success:true, la ruta a los ficheros
    // subidos y los valores recibidos en cada campo del formulario POST

    })
});


app.listen(3000, function() {
    console.log("Servidor lanzado en el puerto 3000");
});
