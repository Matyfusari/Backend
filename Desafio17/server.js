const express = require('express');
const { json,urlencoded } = require('express');
const app = express();
const { engine } = require('express-handlebars');
const { Server: HttpServer } = require('http');
const config = require('./config.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config()
const yargs = require('yargs');
const process = require('process');
// const { fork } = require('child_process');
const cluster = require('cluster');
// const { cpus } = require('os');
const logger = require('./pino.js');
const formRoute = require('./routes/formRoute.js')
const logOutRoute = require('./routes/logOutRoute.js')
const logInRoute = require('./routes/logInRoute.js')
const signInRoute = require('./routes/signInRoute.js')

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
    })
);

app.use(cookieParser())
// const advancedOptions = { useNewUrlParse: true,useUnifiedTopology: true }

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO
    }),
    secret: 'Matias',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}))


const argumentos = process.argv.slice(2);
const parsear = yargs(argumentos).default({
    port: 0,
    modo: 'FORK'
}).alias({
    p: "port",
    m: "modo"
}).argv;

let puerto = process.env.PORT || 8080

// const info = (req,res) => {
//     const info = {
//         arguments: process.argv.slice(2),
//         platform: process.platform,
//         nodeVersion: process.version,
//         memoryTotalReserved: process.memoryUsage().rss,
//         execPath: process.execPath,
//         pid: process.pid,
//         proyectPath: process.cwd(),
//         CPUS: cpus().length
//     }
//     res.render('info',{ info: info })
//     logger.info(info)
// }

// app.get('/info',info)

// app.get('/randoms/:cantidad?',(req,res) => {
//     let cantidad = req.params.cantidad || "100000000";
//     let calculoFork = fork('./calculoFork.js');
//     calculoFork.send(cantidad);
//     calculoFork.on('message',(msj) => {
//         res.send(msj)
//     })
//     // res.send(`NGINX corriendo en el puerto ${puerto} por PID ${process.pid}`);
// })


app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('views','./public/hbs_views');
app.set('view engine','hbs');


// Uso las rutas 

app.use('/formulario',formRoute)
app.use('/logOut',logOutRoute)
app.use('/',logInRoute)
app.use('/signIn',signInRoute)


app.use((req,res,next) => {
    logger.warn('Ruta invalida')
    res.sendStatus(404)
})

const httpServer = new HttpServer(app);

const numCPU = require("os").cpus().length
const modo = parsear.m || 'FORK'
if (modo == 'CLUSTER') {
    if (cluster.isPrimary) {
        for (let i = 0; i < numCPU; i++) {
            cluster.fork()
        }
    } else {
        httpServer.listen(puerto,(err) => {
            console.log(`Escuchando en el puerto ${puerto}`)
            if (err) {
                logger.error('Hubo un error :' + err)
            }
        });
        httpServer.on("error",(error) => {
            console.error(error,"error de conexión")
            logger.error('Hubo un error :' + error)
        });
    }
}
if (modo == 'FORK') {
    httpServer.listen(puerto,(err) => {
        console.log(`Escuchando en el puerto ${puerto}`);
        if (err) {
            logger.error('Hubo un error :' + err)
        }
    });
    httpServer.on("error",(error) => {
        console.error(error,"error de conexión")
        logger.error('Hubo un error :' + error)
    });
}
