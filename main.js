var totalEntradas =0 
var totalSaidas =0 
var saldo =0 

const abrirformulario = () => {
    document.getElementById('tabela').classList.add('d-none')
    document.getElementById('formulario').classList.remove('d-none')
}
const formatarValor =(valor) =>{
    var valor = valor
    valor =parseFloat(valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    return String(valor)
}
const fecharFormulario = () => {
    atualizarTabela()
    document.getElementById('tabela').classList.remove('d-none')
    document.getElementById('formulario').classList.add('d-none')
    limparFormulario()
    totalEntradas =0 
    totalSaidas =0 
    saldo =0 
}
const limparFormulario = () => {
    // const fields = document.querySelectorAll('.valor')
    // fields.forEach(field => field.value = "0")
    document.getElementById('valor').value=0
    document.getElementById('descricao').dataset.index = 'new'
}
const deletarDados = () => {
    const response = confirm(`Deseja realmente excluir toda a tabela?`)
        if (response) {
            localStorage.setItem('db_registro', JSON.stringify([]))
            atualizarTabela()
        }    
}
const lerRegistro = () => getArmazenamentoLocal()
const getArmazenamentoLocal = () => JSON.parse(localStorage.getItem('db_registro')) ?? []
const setArmazenamentoLocal = (dbregistro) => {
    localStorage.setItem("db_registro", JSON.stringify(dbregistro))
}
const criar = (documento) => {
    const dbregistro = lerRegistro()
    dbregistro.push (documento)
    setArmazenamentoLocal(dbregistro)
}
const limpaTabela = () => {
    const rows = document.querySelectorAll('#tabela>tbody tr')
    const rows2 = document.querySelectorAll('#tabela>tfoot tr')
    rows.forEach(row => row.parentNode.removeChild(row))
    rows2.forEach(row => row.parentNode.removeChild(row))
}
const atualizarTabela = () => {
    const dbregistro = lerRegistro()
    limpaTabela()
    dbregistro.forEach(criarLinha)
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <th  id="noprint"></th>
    <th  >Total</th>
    <th>${formatarValor(totalEntradas)}</th>
    <th>${formatarValor(totalSaidas)}</th>
    <th>${formatarValor(saldo)}</th>
    <th colspan="2"></th>       
    `
    document.querySelector('#tabela>tfoot').appendChild(newRow)
}
const criarLinha = (documento, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td id="noprint">
        <button type="button" class="btn btn-primary"  id="edit-${index}" >
            <i class="fa fa-fw fa-1x py-1 fa-pencil-square-o" ></i> 
            Editar
        </button>
    </td>
    <td>${(documento.descricao)}</td>`
    if (documento.valor>=0) {
        totalEntradas+=parseFloat(documento.valor)
        console.log(totalEntradas);
        newRow.innerHTML += `
        <td class="text-success">${formatarValor(documento.valor)}</td>
        <td ></td>`

    }else {
        totalSaidas+=parseFloat(documento.valor)
        newRow.innerHTML += `
        <td ></td>
        <td class="text-danger">${formatarValor(documento.valor)}</td>
        `
    }
        newRow.innerHTML += 
        `
        <td class="text-info">${formatarValor(saldo)}</td>
        <td id="noprint">  
            <button type="button"  class="btn btn-primary"  id="delete-${index}" >
                <i class="fa fa-fw fa-1x py-1 fa-trash" ></i>
                Excluir
            </button>
        </td>
       
    `
        
        saldo += parseFloat(documento.valor)
    document.querySelector('#tabela>tbody').appendChild(newRow)
}
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}
const atualizar = (index, documento) => {
    const dbregistro = lerRegistro()
    dbregistro[index] = documento
    setArmazenamentoLocal(dbregistro)
}
const salvarFormulario = () =>{
    // debugger
    if (isValidFields()) {
        const documento = {
            descricao: document.getElementById('descricao').value,
            valor: document.getElementById('valor').value,
        }
        const index = document.getElementById('descricao').dataset.index
        if (index == 'new') {
            criar(documento)
            atualizarTabela()
            fecharFormulario()
        } else {
            atualizar(index, documento)
            atualizarTabela()
            fecharFormulario()
        }
    }
}
const setDadosFormulario = (registro) => {
    document.getElementById('descricao').value = registro.descricao
    document.getElementById('valor').value = registro.valor
    document.getElementById('descricao').dataset.index = registro.index
    console.log(registro.index+"index");
}
const editarRegistro = (index) => {
    const documento = lerRegistro()[index]
    console.log(index);
    documento.index = index
    setDadosFormulario(documento)
    abrirformulario()
}
const deletarRegistro = (index) => {
    const dbregistro = lerRegistro()
    dbregistro.splice(index, 1)
    setArmazenamentoLocal(dbregistro)
}
const editarDeletar = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')
        if (action == 'edit') {
            editarRegistro(index)
        } else if (action == 'delete') {
            const funcionario = lerRegistro()[index]
            const response = confirm(`Deseja realmente excluir o registro`)
            if (response) {
                deletarRegistro(index)
                atualizarTabela()
            }
        } 
    }
}
document.getElementById('adicionar')
.addEventListener('click', abrirformulario)


document.getElementById('cancelar')
.addEventListener('click', fecharFormulario)

document.getElementById('salvar')
.addEventListener('click', salvarFormulario)

document.querySelector('#tabela>tbody').addEventListener('click', editarDeletar)

document.getElementById('zerar')
.addEventListener('click', deletarDados)
atualizarTabela() 

