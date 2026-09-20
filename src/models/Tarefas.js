const mongoose = require('mongoose');


const TarefaSchema = mongoose.Schema({
    tarefa: {type: String, required: true},
    status: {type: Boolean, default: false},
    idUsuario: {type: String, required: true}
});

const TarefaModel = mongoose.model('Tarefas', TarefaSchema);

class Tarefa {
    constructor(body, user){
        this.body = body;
        this.errors = []
        this.tarefa = null
        this.tarefas = null;
        this.user = user
        
    }

    async salvarTarefa(){
        
        this.valida()
        
        if(this.errors.length > 0) return
        
        this.tarefa = await TarefaModel.create({
            tarefa: this.body.tarefa,
            idUsuario: this.user
        })


    }

    valida(){

        if(!this.body.tarefa){ 
            
            this.errors.push('Adicione sua tarefa')
            return 
        }
        
    }

    async enviaTarefas(idUsuario){
        
        this.tarefas = await TarefaModel.find({idUsuario})
        

    }

    async excluirTarefa(id){

        
        const idTarefa = id.id;

        await TarefaModel.findByIdAndDelete(idTarefa)
    }

}

module.exports = Tarefa;
