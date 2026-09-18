const express = require('express');
const route = express.Router();

const { index } = require('./src/controllers/paginaInicial')
const{ cadastrar, logar } = require('./src/controllers/cadastro')

route.get('/', index)
route.post('/cadastro', cadastrar)
route.post('/login', logar)
route.get('/login', (req, res) => {
    res.render('pagLogin')
})
route.get('/cadastro', (req, res) => {
    res.render('index')
})
route.get('/paginaLoggada', (req, res) => {
    res.render('paginaLoggado')
})

module.exports = route