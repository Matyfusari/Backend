class Ecommerce {

    static carrito = [];

    getProds() {
        return Ecommerce.carrito
    }

    addProd(prod) {
        Ecommerce.carrito.push(prod);
        return Ecommerce.carrito
    }

    updateProd(prod) {
        let producto = Ecommerce.carrito.find(product => product.id === prod.id)
        if (producto) {
            Ecommerce.carrito.map(product => {
                if (product.id == producto.id) {
                    product.nombre = prod.nombre
                    product.imagen = prod.imagen
                    product.stock = prod.stock
                    return product
                } else {
                    return product
                }
            })
            return Ecommerce.carrito
        } else {
            return 'Producto no encontrado'
        }
    }

    deleteProd(id) {
        Ecommerce.carrito = Ecommerce.carrito.filter(prod => prod.id != id)
        return Ecommerce.carrito
    }
}

module.exports = Ecommerce