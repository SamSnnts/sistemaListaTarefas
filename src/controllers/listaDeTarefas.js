const Tarefa = require('../models/Tarefas')

exports.listaTarefas = async (req, res) => {
    const tarefa = new Tarefa(req.body, req.session.user);
   
    await tarefa.salvarTarefa()

    if(tarefa.errors.length > 0 ){
        
        req.session.flash = {
            tipo: 'erro',
            mensagem: tarefa.errors
        }
        req.session.save(() => {
            res.json('Recarregar pagina')
        })
        return
    }


    req.session.save(() => {
        res.json('Recarregar pagina')
        })

}

exports.renderizaTarefas = async (req, res) => {

    const tarefa = new Tarefa();
    await tarefa.enviaTarefas(req.session.user)
    const tarefas = tarefa.tarefas

    res.render('listaTarefas', { tarefas })
};

exports.apagaTarefa = async (req, res) => {
    const tarefa = new Tarefa();
    await tarefa.excluirTarefa(req.body);

    res.json('Deletado com sucesso')
}