const axios = require('axios').default;
// import axios from 'axios'

const addProd = async () => {
    const response = await axios.post('http://localhost:8080/add',{
        "id": 1,
        "nombre": "Prod",
        "imagen": "Link",
        "stock": 10
    })
    console.log(response.data);
}
addProd().then(() => console.log('Prod creado')).catch(err => console.log(err.message))



const updateProd = async () => {
    const response = await axios.post('http://localhost:8080/update',{
        "id": 1,
        "nombre": "Prod1",
        "imagen": "Link-1",
        "stock": 10
    })
    console.log(response.data);
}
updateProd().then(() => console.log('Prod actualizado')).catch(err => console.log(err.message))



const deleProd = async () => {
    const response = await axios.delete('http://localhost:8080/delete',{
        "id": 1,
        "nombre": "Prod",
        "imagen": "Link",
        "stock": 10
    })
    console.log(response.data);
}
deleProd().then(() => console.log('Prod eliminado')).catch(err => console.log(err.message))