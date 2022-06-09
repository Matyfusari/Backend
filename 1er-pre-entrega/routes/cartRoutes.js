const express = require("express")
const { Router } = express
const router = new Router()
const Contenedor = require ("../classItem")
const archivo = new Contenedor("../clientes.json")
const isAdmin = require ("../admin")

router.get("/", (req, res)=>{
    

})

router.post("/", (req,res) =>{
     
})

router.post("/", (req,res) =>{
     
})

router.delet("/", (req, res)=>{

})

router.delete("/", (req, res) =>{

})

module.exports = router