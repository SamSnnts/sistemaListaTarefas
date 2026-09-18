require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.emit('conectadoDB')
})
.catch((e) => {
    console.log(e)
})
const routes = require('./routes');
const session = require('express-session');
const { csrfSync } = require('csrf-sync');
const  {MongoStore} = require('connect-mongo');

const {flash, recuperaInputEmail} = require('./src/middlewares/middlewares')

const app = express();
const port = 3000;

app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({extended : true}));
app.use(session({
    secret: 'uma-chave-secreta',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
}));

app.use(flash)
app.use(recuperaInputEmail)


const {generateToken, csrfSynchronisedProtection} = 
csrfSync({
    getTokenFromRequest: (req) => {
        return req.body._csrf
    }
});

app.use(csrfSynchronisedProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = generateToken(req);
    next()
})



app.use(routes)

app.use((err, req, res, next) => {
    if(err.code === 11000){
        req.session.flash = {
            tipo: 'erro',
            mensagem: ['Conta já cadastrada']
        }
    
        req.session.save((erroSessao) => {
            if (erroSessao) return next(erroSessao);
        })
        return res.redirect('/cadastro');
        
    }
    next(err)
}) 

app.on('conectadoDB', () =>{ 
    app.listen( port, () =>{ 
        console.log( 'http://localhost:3000' )
    })
})