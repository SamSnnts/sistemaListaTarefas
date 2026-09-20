const express = require('express');
const route = express.Router();

const { index } = require('./src/controllers/paginaInicial')
const{ cadastrar, logar, logout } = require('./src/controllers/cadastro')
const{ listaTarefas, renderizaTarefas, apagaTarefa } = require('./src/controllers/listaDeTarefas')
const { verificaLogin } = require('./src/middlewares/middlewares')

route.get('/', index)
route.post('/cadastro', cadastrar)
route.post('/login', logar)
route.get('/login', (req, res) => {
    res.render('pagLogin')
})
route.get('/cadastro', (req, res) => {
    res.render('index')
})
route.post('/lista-de-tarefas', listaTarefas)
route.get('/lista-de-tarefas', verificaLogin, renderizaTarefas)
route.delete('/lista-de-tarefas', apagaTarefa)
route.get('/logout', logout)

module.exports = route