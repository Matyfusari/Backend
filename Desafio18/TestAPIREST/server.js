const express = require('express')
const fs = require('fs')
const Ecommerce = require('./ecommerce.js')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const schemaString = fs.readFileSync('./schemas/products.gql').toString()
const schemaCompilado = buildSchema(schemaString)


const ecommerce = new Ecommerce()
const graphMiddleware = graphqlHTTP({
    schema: schemaCompilado,
    rootValue: {
        obtenerProductos: ecommerce.getProds,
        modificarProducto: ecommerce.updateProd,
        agregarProducto: ecommerce.addProd,
        eliminarProducto: ecommerce.deleteProd
    },
    graphiql: true
})


// app.use(express.json())

// app.post('/add',(req,res) => {
//     let carrito = ecommerce.addProd(req.body)
//     res.send(carrito);
// });

// app.post('/update',(req,res) => {
//     let producto = ecommerce.updateProd(req.body)
//     res.send(producto);
// });

// app.delete('/delete',(req,res) => {
//     let carrito = ecommerce.deleteProd(req.body.id)
//     console.log(req.body.id);
//     res.send(carrito);
// });

const app = express()
app.use('/graphql',graphMiddleware)


app.listen(8080,() => {
    console.log(`Conectado en el puerto 8080`);
})

module.exports = app