const API_URL = 'http://localhost:3000/api/alunos'

const form = document.getElementById('aluno-form');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const datadenascimento = document.getElementById('datadenascimento');
const cpf = document.getElementById('cpf');
const rg = document.getElementById('rg');
const curso = document.getElementById('curso');
const alunoId = document.getElementById('aluno-id');

const tabela = document.getElementById('alunos-tbody');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');


// =====================================================
// LISTAR ALUNOS
// =====================================================

async function carregarAlunos() {

    try {

        const resposta = await fetch('/api/alunos');

        const alunos = await resposta.json();

        tabela.innerHTML = '';

        alunos.forEach(aluno => {

            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.datadenascimento}</td>
                <td>${aluno.cpf}</td>
                <td>${aluno.rg}</td>
                <td>${aluno.curso}</td>
                <td>
                    <button onclick="editarAluno(${aluno.id})">
                        Editar
                    </button>

                    <button onclick="excluirAluno(${aluno.id})">
                        Excluir
                    </button>
                </td>
            `;

            tabela.appendChild(linha);

        });

    } catch (erro) {

        console.error('Erro ao carregar alunos:', erro);

    }

}


// =====================================================
// SALVAR ALUNO
// =====================================================

form.addEventListener('submit', async function(evento) {

    evento.preventDefault();

    const dados = {
        nome: nome.value,
        email: email.value,
        datadenascimento: datadenascimento.value,
        cpf: cpf.value,
        rg: rg.value,
        curso: curso.value      
    };

    try {

        let resposta;

        // Se existe ID, estamos editando
        if (alunoId.value) {

            resposta = await fetch(`/api/alunos/${alunoId.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

        } else {

            // Se não existe ID, estamos criando
            resposta = await fetch('/api/alunos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

        }

        if (!resposta.ok) {

            const erro = await resposta.json();

            alert(erro.erro || 'Erro ao salvar aluno');

            return;

        }

        limparFormulario();

        carregarAlunos();

    } catch (erro) {

        console.error('Erro:', erro);

        alert('Erro ao conectar com o servidor.');

    }

});


// =====================================================
// EDITAR ALUNO
// =====================================================

async function editarAluno(id) {

    try {

        const resposta = await fetch('/api/alunos');

        const alunos = await resposta.json();

        const aluno = alunos.find(a => a.id === id);

        if (!aluno) {
            return;
        }

        alunoId.value = aluno.id;
        nome.value = aluno.nome;
        email.value = aluno.email;
        datadenascimento.value = aluno.datadenascimento;
        cpf.value = aluno.cpf;
        rg.value = aluno.rg;
        curso.value = aluno.curso;

        btnSave.textContent = 'Atualizar Aluno';
        btnCancel.style.display = 'inline-block';

    } catch (erro) {

        console.error('Erro ao editar:', erro);

    }

}


// =====================================================
// EXCLUIR ALUNO
// =====================================================

async function excluirAluno(id) {

    if (!confirm('Deseja realmente excluir este aluno?')) {
        return;
    }

    try {

        const resposta = await fetch(`/api/alunos/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {

            alert('Erro ao excluir aluno.');

            return;

        }

        carregarAlunos();

    } catch (erro) {

        console.error('Erro ao excluir:', erro);

    }

}


// =====================================================
// CANCELAR EDIÇÃO
// =====================================================

btnCancel.addEventListener('click', function() {

    limparFormulario();

});


// =====================================================
// LIMPAR FORMULÁRIO
// =====================================================

function limparFormulario() {

    form.reset();

    alunoId.value = '';

    btnSave.textContent = 'Salvar Aluno';

    btnCancel.style.display = 'none';

}


// =====================================================
// CARREGAR ALUNOS AO ABRIR A PÁGINA
// =====================================================

carregarAlunos();