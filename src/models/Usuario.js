const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

//cria um schema mongoose e guarda dentro de uma variavel
const UsuarioSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    senha: { type: String, required: true } 
});

//cria um model mongoose define do que se trata(vai pra base de dados) e qual schema usar
const UsuarioModel = mongoose.model('Usuarios', UsuarioSchema);


class Usuario{

    //O body aq se trata do corpo da requisição que vai ser mandado la do controller
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null
        this.senha = body.senha
    }

    async registrar(){
        //executa valida
        await this.valida();

        //case tenha adicionado algum valor ao array ERRORS, retorna la pro controller
        if(this.errors.length > 0) return

        //faz um hash da senha que veio no corpo da requisição e define o numero de processamento no segundo parametro e guarda em uma variavel
        const senhaHash = await bcrypt.hash(this.senha, 6)

        //cria no banco de dados usando o model e envia o email e a senha e guarda o documento que foi criado na base de dados em this.user
        this.user = await UsuarioModel.create({
            email :this.body.email,
            senha: senhaHash
        })
        
    }

    async login(){

        //executa o metodo emailExiste
        await this.emailExiste('Conta não cadastrada')

        //caso tenha pelo menos 1 valor no array ERRORS entra na condicional
        if(this.errors.length > 0) return
        

        //compara a senha mandada no corpo da requisição com a senha do documento do usuario que foi obtido no email, caso nao seja igual, entra na condicional
        if(!bcrypt.compareSync(this.senha, this.user.senha)){
            //limpa user para caso senha esteja errada nao conseguir logar
            this.user = null
            //da um push adicionando um valor para o array ERRORS
            this.errors.push('Senha incorreta')
            return
        }


    }

    async valida(){

        //executa o metodo cleanUP
        this.cleanUp()

        //o email mandado no corpo da requisição nao for um email entra na condicional
        if(!isEmail(this.body.email)){
            //da um push em ERRORS adicionando um valor
            this.errors.push('Email inválido');
        }

        //espera executar o metodo emailExiste e la ele vai ver se existe algum email em algum documento igual ao mandado no corpo da requisição, caso encontre, vai dar err 11000
        //busca no model algum documento com o email igual ao email mandado no corpo da requisição e se tiver guarda o documento em this.user
        this.user = await UsuarioModel.findOne({email: this.body.email});
        
        //se não tiver achado entra na condicional
        if(this.user){
            //da um push adicionando um valor para o array ERRORS
            this.errors.push('Email já cadastrado');
            return
        }

        //se a senha tiver menos que 8 ou mais que 12 digitos, entra na condicional
        if(this.senha.length < 8 || this.senha.length > 12) {
            //adiciona um valor por push no array ERRORS
             this.errors.push('A senha precisa estar entre 8 e 12 caracteres')
        }
    }

    cleanUp(){

        //faz um loop onde a variavel key vai ter o valor do indice atual do loop e esse loop é feita nas chaves do this.body
        for(const key in this.body){
            //se o tipo do valor da chave do loop atual de this.body for diferente de string, entra na condicional
            if(typeof this.body[key] !== 'string'){
                //deixa vazio o valor da chave atual de this.body
                this.body[key] = ''
            }
        }
    }

    async emailExiste(msg){

        //busca no model algum documento com o email igual ao email mandado no corpo da requisição e se tiver guarda o documento em this.user
        this.user = await UsuarioModel.findOne({email: this.body.email});
        
        //se não tiver achado entra na condicional
        if(!this.user){
            //da um push adicionando um valor para o array ERRORS
            this.errors.push(msg);
            return
        }
    }    
    
}
//exporta a class Usuario
module.exports = Usuario