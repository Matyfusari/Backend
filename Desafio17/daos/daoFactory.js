const Contenedor = require('../contenedores/ContenedorMongoDb.js');
const config = require('../config.js');


class DaoFactory {
    create(type) {
        if (type === 'mongo') return new Contenedor(config.mongodb.collectionMessage);
    }
}

module.exports = { DaoFactory }