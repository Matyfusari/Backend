// import assert from 'assert';
const assert = require('assert')
// import { describe,it } from 'mocha';
const { describe,it } = require('mocha')
const Ecommerce = require('./ecommerce.js')

const ecommerce = new Ecommerce()

describe('Test del ecommerce',async () => {
    it('Ingresa un producto, debe devolver el carrito con el producto',() => {
        const resultado = ecommerce.addProd({
            "id": 1,
            "nombre": "Prod1",
            "imagen": "Link-1",
            "stock": 10
        })
        assert.deepEqual(resultado,[{
            "id": 1,
            "nombre": "Prod1",
            "imagen": "Link-1",
            "stock": 10
        }])
    });
    it('Ingreso un producto, debe devolver el carrito con el producto actualizado',() => {
        const resultado = ecommerce.updateProd({
            "id": 1,
            "nombre": "Prod",
            "imagen": "Link",
            "stock": 10
        })
        assert.deepEqual(resultado,[{
            "id": 1,
            "nombre": "Prod",
            "imagen": "Link",
            "stock": 10
        }])
    });
    it('Ingreso un producto, devuelve el carrito sin el producto',() => {
        const resultado = ecommerce.deleteProd(1)
        assert.deepEqual(resultado,[])
    });
})