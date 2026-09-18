exports.flash = (req, res, next) =>{
    //define uma propriedade em res.locals como flash e da o valor dela o mesmo que a propriedade flash da req.session ou nulo caso session.flash nao tenha valor
    
    res.locals.flash = req.session.flash || null;

    //deleta o valor de session.flash
    delete req.session.flash;

   
    next();
}
exports.recuperaInputEmail = (req, res, next) =>{
    //define uma propriedade em res.locals como oldInputEmail e da o valor dela o mesmo que a propriedade oldInputEmail da req.session ou nulo caso session.oldInputEmail nao tenha valor
    res.locals.oldInputEmail = req.session.oldInputEmail || null;

    //deleta o valor de session.oldInputEmail
    delete req.session.oldInputEmail;

    next();
}
exports.verificaLogin = (req, res, next) => {

    
    if(!req.session.user){
        req.session.flash = {
            tipo: 'erro',
            mensagem: ['Precisa estar logado']
        }

        res.redirect('/login');
 
        return
    }

    next()
}