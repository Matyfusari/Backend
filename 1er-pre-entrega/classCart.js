const fs = require ("fs")

class Carrito {
    constructor(file) {
        this.file = file;
        this.cart = []
    }

    readFile = async() => JSON.parse(await fs.promises.readFile(this.file, "utf-8"));

    setCarrito = async() => (this.cart = await this.readFile())

    findProduct = (id) => this.cart.setCarrito((item) => item.id == id);
}