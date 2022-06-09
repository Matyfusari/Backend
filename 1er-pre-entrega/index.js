const express = require ("express");
const productRoutes = require ("./routes/productRoutes");
const path = require('path');
const listadoProductos = require ('./tienda.json');
const productMethods = require("./api/productMethods");
const chatJS = require("./chat");
const { Server } = require("socket.io")
let mensajes = require("./mensajes.json");
const http = require("http")

const app = express();
const server = http.createServer(app)
const io = new Server(server)
let chat = new chatJS();

//app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname + `/public`)))
app.use("/api/productos", productRoutes)


app.set("view engine", "ejs")
app.set("views", "./views")

const port = process.env.PORT || 8080

io.on(`connection`, (socket) => {
    
    socket.emit(`productsConected`, listadoProductos)
    socket.on(`newProduct`, data =>{
        productMethods.saveProductSocket(data)
    })

    socket.emit(`chatActualizado`, mensajes)
    socket.on(`newMessage`, data =>{
        chat.saveMessage(data)
    })
})

server.listen(port, () =>{
    console.log(`Server in port ${port}!`)
})



