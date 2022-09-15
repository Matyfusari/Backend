const express = require('express');
const app = express();
const formRoute = require('express').Router()
const { faker } = require('@faker-js/faker');
const config = require('../config.js');
const DaoCartMongo = require('../daos/mensajes/MessageDaoMongoDB.js');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const { MongoClient } = require('mongodb');

//Conección con mongo
const mongo = new MongoClient(config.mongodb.mongo);
(async () => {
    await mongo.connect();
})();

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

let conectionMongo = mongo
let contenedorCarritoImportado = new DaoCartMongo(config.mongodb.collectionMessage)

formRoute.get('/:username',async (req,res) => {
    const mongo = new MongoClient(config.mongodb.mongo);
    await mongo.connect();
    let username = req.params.username;
    req.session.username = username;
    req.session.request = req.session.request == null ? 1 : req.session.request + 1
    res.render('formulario')

    socketServer.on('connection',async (socket) => {
        socket.emit('user',username);
        socket.emit('messages',await contenedorCarritoImportado.getAll())
        let productos = [
            {
                nombre: faker.name.findName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                nombre: faker.name.findName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                nombre: faker.name.findName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                nombre: faker.name.findName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                nombre: faker.name.findName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
        ]
        socket.emit('products',productos)

        socket.on('new_message',async (mensaje) => {
            console.log(mensaje);
            await contenedorCarritoImportado.saveMessage(mensaje)
            let mensajes = await contenedorCarritoImportado.getAll();
            socketServer.sockets.emit('messages',mensajes);
        });

        socket.on('new_products',async (products) => {
            let productos = products
            socketServer.sockets.emit('products',productos);
        });

        socket.on('new_user',async (user) => {
            let sesion = await conectionMongo.db('test').collection('sessions').find({}).toArray();
            console.log(sesion);
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

module.exports = formRoute;