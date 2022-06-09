const ClassItem = require ("../classItem")
const productos = new ClassItem("./tienda.json")

// //Métodos Productos

// const getProducts = (res) => productos.getAll().then(response => res.send(response))

// const getProductById = (req, res) => {
//     productos.getById (req.params.id)
//         .then(response => res.send(response !== null ? response : {err: "No existe el producto"}))
// }

// const deleteProduct = (req, res) => {
//     productos.deleteById(req.params.id).then(response => res.send(
//         `El producto con ID ${req.params.id} fue eliminado.
//         Stock actual: ${response}`
//     ))
// }

// const editProduct = (req, res) => productos.editById(req.params.id, req.body).then(response => res.send(response))

// //Métodos Form

// const allProducts = (res) => productos.getAll().then(response => res.render(`productos`, {data: response}))

// const saveProduct = (req, res, url) => {
//     let file = req.file

//     if(!file){
//         return res.status(400).send({message: "Error al cargar el producto"})
//     }

//     let newProduct = {
//         title: req.body.title,
//         price: req.body.price,
//         thumbnail: req.file.path
//     }

//     productos.save(newProduct).then(response => console.log(response))
//     res.redirect(url)
// }

const getForm = (res, url) => res.sendFile(url, {root: '.'});

const saveProductSocket = object => {
    productos.save(object).then(res => console.log(res))
}

module.exports = {getForm, saveProductSocket}