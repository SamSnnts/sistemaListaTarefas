const Usuario = require('../models/Usuario');

exports.cadastrar = async (req, res) => {
    //Faz uma instancia de Usuario e manda o req.body por parametro e guarda em uma variavel
    const usuario = new Usuario(req.body)

    //espera terminar o metodo registrar da instancia usuario
    await usuario.registrar()

    //quando sair do metodo registrar: Se a propriedade ERRORS de usuario tiver pelo menos 1 valor entra na condicional
    if(usuario.errors.length > 0) {

        //cria uma propriedade em session e define o objeto
        req.session.flash = { 
            tipo: 'erro',
            mensagem: usuario.errors
        };

        //salva a session e cade de erro executa callback
        req.session.save((err) => {

            if(err) {
                console.log(err);
                //da o status como 500(erro de servidor) e responde a mensagem
                res.status(500).send('Erro ao tentar salvar sessão')
            }
        })

        //cria uma propriedade em session e define como o email que foi mandado no body do usuario
        req.session.oldInputEmail = usuario.body.email;

        //redireciona para a pagina home
        return res.redirect('/')
    }

    //cria uma propriedade em session e define o objeto
    
    req.session.flash = {
        tipo: 'sucess',
        mensagem: ['Usuário Cadastrado']
    }

    req.session.save((err) => {
    if (err) {
        return next(err)
    };
    })

    //redireciona para a pagina de login
    res.redirect('/login')
    
}
exports.logar = async (req, res) => {
    //Faz uma instancia de Usuario e manda o req.body por parametro e guarda em uma variavel
    const usuario = new Usuario(req.body);

    //tenta esse bloco
    try{
        //espera terminar o metodo login da instancia usuario
        await usuario.login();

        //quando sair do metodo registrar: Se a propriedade ERRORS de usuario tiver pelo menos 1 valor entra na condicional
        if(usuario.errors.length > 0) {

            //cria uma propriedade em session e define o objeto
            req.session.flash = { 
                tipo: 'erro',
                mensagem: usuario.errors
            };

            //salva a session e cade de erro executa callback
            req.session.save((err) => {

                if(err) {
                    console.log(err);
                    //da o status como 500(erro de servidor) e responde a mensagem
                    res.status(500).send('Erro ao tentar salvar sessão')
                }
            })
            //redireciona para a pagina home
            return res.redirect('/login')
        }
        //cria uma propriedade em session e define o objeto
        req.session.flash = {
            tipo: 'sucess',
            mensagem: ['Login bem sucedido']
        }

        req.session.user = usuario.user._id
        

        req.session.save(() => {
            //redireciona para a pagina: paginaLoggada
            res.redirect('/lista-de-tarefas')
        })
        

    //caso nao de certo executa essa
    }catch(e){
        console.log(e)
    }
}
exports.logout = async (req, res) => {
    req.session.destroy();
    
    res.redirect('/login')

}