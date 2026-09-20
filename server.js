require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
mongoose.connect(process.env.MONGO_URI)
.catch((e) => {
    console.log(e)
})
const routes = require('./routes');
const session = require('express-session');
const { csrfSync } = require('csrf-sync');
const  {MongoStore} = require('connect-mongo');

const {flash, recuperaInputEmail} = require('./src/middlewares/middlewares')

const app = express();


app.use(express.static(path.resolve(process.cwd(), 'public')));

app.set('views', path.resolve(process.cwd(), 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
}));

app.use(flash)
app.use(recuperaInputEmail)


const {generateToken, csrfSynchronisedProtection} = 
csrfSync({
    getTokenFromRequest: (req) => {
        if (req.is('application/x-www-form-urlencoded')) {
            return req.body._csrf
        }

        return req.headers['x-csrf-token']
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


module.exports = app
