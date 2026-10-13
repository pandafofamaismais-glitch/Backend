const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors()); // Permite que o frontend acesse a API
app.use(express.json()); // Permite que o backend receba dados em JSON
app.use(express.static(path.join(__dirname, 'public')));

// Servir arquivos do frontend

// Função auxiliar para ler o banco de dados do arquivo JSON
function LerBancoDados() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({
            alunos: []
        },
        null, 2));
    }

    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

// Função auxiliar para salvar no banco de dados
function salvarBancoDados(dados) {
    fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
    // null, 2 serve para deixar o JSON formatado e fácil de ler
}

// --- ROTAS DA API (CRUD) ---

// CREATE (Criar - POST)
app.post('/api/alunos', (req, res) => {
    console.log(req.body);
    const { nome, email, datadenascimento, cpf, rg, curso } = req.body;

    // Validação simples
    if (!nome || !email || !datadenascimento || !cpf || !rg || !curso) {
        return res.status(400).json({
            erro: 'Todos os campos são obrigatórios!'
        });
    }

    const db = LerBancoDados();

    // Calcula o próximo ID
    const nextId = db.alunos.length > 0
        ? Math.max(...db.alunos.map(a => a.id)) + 1
        : 1;

    const novoAluno = {
        id: nextId,
        nome,
        email,
        datadenascimento,
        cpf,
        rg,
        curso
    };

    db.alunos.push(novoAluno);
    salvarBancoDados(db); // Salva a alteração no arquivo db.json

    res.status(201).json(novoAluno);
});

// READ (Ler/Lista - GET)
app.get('/api/alunos', (req, res) => {
    const db = LerBancoDados();
    res.json(db.alunos);
});

// UPDATE (Atualizar - PUT)
app.put('/api/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email, datadenascimento, cpf, rg, curso } = req.body;

    const db = LerBancoDados();
    const index = db.alunos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            erro: 'Aluno não encontrado!'
        });
    }

    db.alunos[index] = {
        id,
        nome,
        email,
        datadenascimento,
        cpf,
        rg,
        curso
    };

    salvarBancoDados(db);

    res.json(db.alunos[index]);
});


// DELETE (Excluir)
app.delete('/api/alunos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const db = LerBancoDados();

    const index = db.alunos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            erro: 'Aluno não encontrado!'
        });
    }

    db.alunos.splice(index, 1);

    salvarBancoDados(db);

    res.status(204).send();

});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`👉 Acesse: http://localhost:${PORT}`);
    console.log(`📂 Banco de dados local ativo no arquivo db.json`);
});