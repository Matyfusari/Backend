const fs = require ("fs");

class Contenedor {
    constructor (file){
        this.file = file;
    }

    async save(object) {
        const item = await new Promise ((resolve, reject) =>{
            return fs.readFile(`./${this.file}`, `utf-8`, (err, data) =>{
                if(err){
                    reject(err)
                }
                const lista = JSON.parse(data);
                const prod = { ...object, id: lista.length !== 0 ? lista[lista.length - 1].id + 1 : 1}
                lista.push(prod)                
                fs.writeFile(`./${this.file}`, JSON.stringify(lista, null, 2), `utf-8`, (err) => err && console.log(err));
                return resolve(prod)
            })
        })
        return item;
    }

    async getById(id) {
        const productos = await this.getAll()
        const index = productos.find((item) =>{
            return item.id === parseInt(id)
        })
        try{
            if(index){
                return index
            }else{
                return console.log("Producto no encontrado")
            }
        }
        catch(err) {
            console.log(err)
        }
    }

    async getAll() {
        const listadoProductos = await new Promise((res, rej) =>{
            return fs.readFile(`./${this.file}`, `utf-8`, (err, data) =>{
                if(err) rej(err);
                return res(JSON.parse(data))
            })
        })
        return listadoProductos;
    }

    async deleteById(id) {
        const borrarProducto = await new Promise((res, rej) =>{
            return fs.readFile(`./${this.file}`, `utf-8`, (err, data) =>{
                if(err)return rej(err)

                const lista = JSON.parse(data);
                const listaActualizada = lista.filter(item => item.id !== parseInt(id, 10))
                fs.writeFile(`./${this.file}`, JSON.stringify(listaActualizada, null, 2),`utf-8`, (err)=> err && console.log(err))
                return res(listaActualizada)
            })
        })
        return borrarProducto;
    }

    async getRandom() {
        const listadoProductos = await new Promise ((res, rej) => {
            return fs.readFile(`./${this.file}`, `utf-8`, (err, data) =>{
                if(err) return rej(err);
                return res(JSON.parse(data));
            })
        })
        const productoRandom = (min, max) => Math.floor(math.random() * (max - min)) + min;
        return listadoProductos[productoRandom(0, 3)]
    }

    async editById(id, item){
        const productoEditado = await new Promise((res, rej) => {
            return fs.readFile(`./${this.file}`, `utf-8`, (err, data) =>{
                if(err) rej(err)
                
                const lista = JSON.parse(data)
                const nuevaLista = lista.filter(item => item.id !== parseInt(id, 10))
                const productoActualizado = {
                    id: (nuevaLista[nuevaLista.length-1].id) + 1,
                    title: item.name,
                    price: item.price,
                    thumbnail: item.thumbnail
                }
                nuevaLista.push(productoActualizado)
                fs.writeFile(`./${this.file}`, JSON.stringify(nuevaLista, null, 2), `utf-8`, (err) => err && console.log(err));
                return res(nuevaLista)
            })
        })
        return productoEditado;
    }


}

module.exports = Contenedor;

