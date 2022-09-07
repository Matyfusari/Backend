import productRouter from './router/productoRouter.js';
import carritoRouter from './router/carritoRouter.js';
import express,{ json,urlencoded } from 'express';
const app = express();
import { conectionMongo,ContenedorCarrito } from './daos/index.js'
import { engine } from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { faker } from '@faker-js/faker'
import config from './config.js'
import cookieParser from 'cookie-parser';
import session from 'express-session'
import MongoStore from 'connect-mongo';
import { MongoClient } from 'mongodb'
import passport from './passport.js'
import yargs from 'yargs'
import { cpus } from 'os';
import logger from './pino.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import twilio from 'twilio'
const cliente = twilio(process.env.TWILIO_ACCOUNT,process.env.TWILIO_TOKEN);

//PARA MANDAR MAILS
const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


let contenedor = ContenedorCarrito;


app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/productos',productRouter);
app.use('/carrito',carritoRouter);


app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
    })
);
app.use(express.static("public"));
app.set('views','./public/hbs_views');
app.set('view engine','hbs');


app.use(cookieParser())


app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongodb.mongo
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

app.get('/',async (req,res) => {
    res.render('logIn')
});

app.post('/',passport.authenticate('login',{ failureRedirect: '/signIn',failureMessage: true }),passport.authenticate('autenticado',{ failureRedirect: '/',failureMessage: true }),async (req,res) => {
    res.redirect('/formulario/' + req.body.username)
})

app.get('/logOut',async (req,res) => {
    req.session.destroy((err) => {
        console.log(err);
        console.log('Hasta luego');
    })
    res.render('logOut')
})

app.get('/signIn',async (req,res) => {
    res.render('signIn')
})

app.post('/signIn',passport.authenticate('registracion',{ failureRedirect: '/',failureMessage: true }),async (req,res) => {
    let passwordHash = bcrypt.hashSync(req.body.password,10);
    let username = req.body.username;
    let name = req.body.nombre;
    let direccion = req.body.direccion;
    let edad = req.body.edad;
    let telefono = req.body.telefono;
    let idCarrito = await contenedor.createCarrito();

    //Mando mail cuando se registre el usuario
    transport.sendMail({
        from: 'Matias <fusarimati03@gmail.com>',
        to: process.env.EMAIL,
        html: `<h1>Que buen mail</h1>
        <span>Mail del usuario: ${username}</span>
        <span>Nombre del usuario: ${name}</span>
        <span>Dirección del usuario: ${direccion}</span>
        <span>Edad del usuario: ${edad}</span>
        <span>Telefono del usuario: ${telefono}</span>`,
        subject: 'Nuevo registro'
    }).then(result => {
        console.log(result);
    }).catch(err => console.log(err))

    await conectionMongo.db('users').collection('usuarios').insertOne({ username,passwordHash,name,direccion,edad,telefono,idCarrito });
    res.redirect('/formulario/' + req.body.username)
})

app.get('/formulario/:username',async (req,res) => {
    const mongo = new MongoClient(config.mongodb.mongo);
    await mongo.connect();
    let username = req.params.username;
    req.session.username = username;
    req.session.request = req.session.request == null ? 1 : req.session.request + 1
    res.render('formulario')

    let userLoged = await conectionMongo.db('users').collection('usuarios').findOne({ username: username });

    socketServer.on('connection',async (socket) => {
        let carrito = await conectionMongo.db('ecommerce').collection('carrito').findOne({ _id: userLoged.idCarrito });
        socket.emit('cart',carrito)

        socket.on('addSameProd',(cart) => {
            ContenedorCarrito.saveProductInCart(cart);
        })

        socket.on('deleteProd',(cart) => {
            ContenedorCarrito.deleteProdInCart(cart);
        })


        let msg = ''
        const crearMensaje = (productos) => {
            for (const prod of productos) {
                msg += `Producto ${prod.id}: ${prod.nombre} 
                Precio: ${prod.precio}
                Cantidad: ${prod.cantidad}

                `
            }
            return msg
        }

        socket.on('purchase',async (cart) => {
            //Mando mail cuando se registre el usuario
            let mensaje = crearMensaje(cart.productos);

            transport.sendMail({
                from: 'Matias <aguileramati50@gmail.com>',
                to: process.env.EMAIL,
                html: mensaje,
                subject: `Nuevo pedido de ${username}` + mensaje
            }).then(result => {
                console.log(result);
            }).catch(err => console.log(err))

            //Mando Whatsapp
            cliente.messages.create({
                to: process.env.TWILIO_TO,
                from: process.env.TWILIO_FROM,
                body: `Nuevo pedido de ${username}
                ` + mensaje
            }).then((data) => {
                console.log('Mensaje enviado correctamente');
            }).catch(err => console.log(err));

            //Mando mensaje al usuario que compró
            cliente.messages.create({
                to: process.env.TWILIO_USERPURCHASE,
                from: process.env.TWILIO_FROMPURCHASE,
                body: 'Su pedido a sigo recibido y se encuentra en proceso'
            }).then((data) => {
                console.log('Mensaje enviado correctamente');
            }).catch(err => console.log(err));

            await conectionMongo.db('ecommerce').collection('ordenes').insertOne(cart);
        })

        socket.on('deleteCart',async (cart) => {
            ContenedorCarrito.purchaseCart(cart)
            carrito = await conectionMongo.db('ecommerce').collection('carrito').findOne({ _id: userLoged.idCarrito });
            socket.emit('cart',carrito)
        })

        socket.emit('user',username);
        let productos = [
            {
                id: 0,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                id: 1,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                id: 3,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                id: 4,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                id: 5,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
        ]
        socket.emit('products',productos)

        socket.on('new_user',async (user) => {
            let sesion = await conectionMongo.db('test').collection('sessions').find({}).toArray();
            let usuario = sesion[sesion.length - 1];
            if (usuario === undefined) {
                console.log('Sesión cerrada');
                socket.emit('user',false);
            } else {
                socket.emit('user',username);
            }
        })
    })
})

app.use((req,res,next) => {
    logger.warn('Ruta invalida')
    res.sendStatus(404)
})

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

// const numCPU = require("os").cpus().length
const modo = parsear.m || 'FORK'
if (modo == 'CLUSTER') {
    if (cluster.isPrimary) {
        for (let i = 0; i < cpus.length; i++) {
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
