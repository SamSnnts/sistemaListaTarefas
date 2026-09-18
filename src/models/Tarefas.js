const mongoose = require('mongoose');


const TarefaSchema = mongoose.Schema({
    tarefa: {type: String, required: true},
    status: {type: Boolean, default: false},
    
});

const TarefaModel = mongoose.model('Tarefas', TarefaSchema);

class Tarefa {
    constructor(body){
        this.body = body;
        this.errors = []
        this.tarefa = null
        this.tarefas = null
        
    }

    async salvarTarefa(){
        
        this.valida()
        
        if(this.errors.length > 0) return
        
        this.tarefa = await TarefaModel.create({
            tarefa: this.body.tarefa
        })


    }

    valida(){

        if(!this.body.tarefa){ 
            
            this.errors.push('Adicione sua tarefa')
            return 
        }
        
    }

    async enviaTarefas(){
        this.tarefas = await TarefaModel.find({})

    }

    async excluirTarefa(id){

        
        const idTarefa = id.id;

        await TarefaModel.findByIdAndDelete(idTarefa)
    }

}

module.exports = Tarefa;
