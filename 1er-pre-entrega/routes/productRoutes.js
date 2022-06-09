const express = require("express")
const { Router } = express
const productRouter = new Router()
const Contenedor = require("../classItem")
const archivo = new Contenedor("tienda.json")
const isAdmin = require("../admin")


const productMethods = require("../api/productMethods")

const urlForm = "/form"
const form = 'public/index.html'

productRouter.get("/", async (req, res) => {
   let productos = await archivo.getAll()
   res.render("templates/products", { data: productos })


})

productRouter.get("/:id", async (req, res) => {
   let prodId = await archivo.getById(req.params.id)
   if (prodId) {
      res.render("templates/products", { data: [prodId] })
   } else {
      res.render("templates/noExiste", { data: req.params.id })
   }
})

productRouter.post("/", isAdmin, async (req, res) => {
      let nuevoProducto = {
         title: req.body.title,
         descripcion: req.body.descripcion,
         price: parseInt(req.body.price),
         thumbnail: req.body.thumbnail,
         stock: req.body.stock,
         timestamp: Date.now()
               
     } 
     
   await archivo.save(nuevoProducto)   
   res.send("Producto cargado correctamente")
})

productRouter.put("/", isAdmin, async (req, res) => {
   let id = req.params.id

   const listaProductos = await archivo.getAll();
   const productoId = await archivo.getByID(id);

   const idFind = listaProductos.findIndex((item) => item.id == id)

   if (idFind >= 0) {
      listaProductos[idFind] = { ...req.body, id: productoId.id }
      fs.writeFileSync("../tienda.json", JSON.stringify(listaProductos));
      res.send("Producto Actualizado")
   } else {
      res.send(`Producto con id ${id} no está en la tienda.`)
   }
})

productRouter.delete("/:id", isAdmin, async (req, res) => {
   const borrarId = req.params.id;

   res.send(await archivo.deleteById(borrarId))
})


module.exports = productRouter