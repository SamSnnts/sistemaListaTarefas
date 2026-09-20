
const buttonTarefa = document.querySelector('#adiciona-tarefa');
const inputTarefa = document.querySelector('.input-tarefa');
//seleciona o meta que tem esse nome marcado e pega o atributo content que é o csrfToken
const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute('content');
const buttonExcluir = document.querySelectorAll('.button-excluir')
const buttonEditar = document.querySelector('.button-editar')

//manda uma req com o csrfToken no header e o campo tarefa para o caminho dito
buttonTarefa.addEventListener('click', () =>{
    fetch('/lista-de-tarefas', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'x-csrf-token': token
        },
        body: JSON.stringify({
            tarefa: inputTarefa.value
        })
    })
    .then(res => res.json())
    //serve para identificaçao se deu tudo certo
    .then(res => {
        if(res === 'Recarregar pagina'){
            location.reload()
        }
    })
    
});



buttonExcluir.forEach(button => {
    
    button.addEventListener('click',  (e) => {
    const el = e.target;
    const tr = el.parentElement.parentElement;
    const id = tr.dataset.id
        //esse id é o _id la do banco de dados
      fetch('/lista-de-tarefas', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': token
            },
            body: JSON.stringify({
                id
            })
    })
    .then(res => res.json())
    .then(res => {
        if(res === 'Deletado com sucesso'){
            location.reload()
        }else{
            throw new Error('Falha ao deletar')
        }
    })
    .catch(e => {
        console.log(e)
    })

})
})
