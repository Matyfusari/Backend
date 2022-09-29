// import { expect } from 'chai'
const { expect } = require('chai')
// import supertest from 'supertest'
const supertest = require('supertest')
// import { describe,it } from 'mocha'
const { describe,it } = require('mocha')
// import app from './'
const app = require('./server')

const request = supertest(app)

describe('API Rest Test',() => {
    it('Debería devolver 404 si no se encuentra una ruta',async () => {
        const response = await request.get('localhost:8080/add')
        expect(response.status).to.eql(404)
    });
    describe('API Test',() => {
        it('Debería responder 200 cuando se consulta a add',async () => {
            const response = await request.post('/add')
            expect(response.status).to.eql(200)
        });
        it('Debería responder 200 cuando se consulta a update',async () => {
            const response = await request.post('/update')
            expect(response.status).to.eql(200)
        });
        it('Debería responder 200 cuando se consulta a delete',async () => {
            const response = await request.delete('/delete')
            expect(response.status).to.eql(200)
        });
    });
});