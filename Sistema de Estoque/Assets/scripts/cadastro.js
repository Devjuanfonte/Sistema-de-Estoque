let produtos = JSON.parse(localStorage.getItem('produtos')) || []; // Carregar produtos do localStorage ou usar uma lista vazia

// Corrigir produtos sem ID (produtos antigos)
produtos.forEach((produto, index) => {
    if (typeof produto.id === "undefined") {
        produto.id = index + 1; // Ou use gerarIdSequencial() se quiser evitar duplicatas
    }
});
localStorage.setItem('produtos', JSON.stringify(produtos));

// Função para buscar um produto na lista, considerando maiúsculas/minúsculas
function buscarProduto(nome) {
    nome = nome.trim().toLowerCase();
    return produtos.find(produto => produto.nome.toLowerCase() === nome);
}

// Função para gerar ID sequencial
function gerarIdSequencial() {
    const idsExistentes = produtos.map(p => p.id || 0);
    return idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;
}

// Função para cadastrar ou atualizar produto
function cadastrarProduto(nome, marca, quantidade, dataRecebimento, quemRecebeu) {
    const nomeNormalizado = nome.trim().toLowerCase();
    const produtoExistente = buscarProduto(nomeNormalizado);

    if (produtoExistente) {
        // Atualiza a quantidade
        produtoExistente.quantidade += quantidade;
        // Adiciona o histórico
        produtoExistente.historico.push({
            data: dataRecebimento,
            quantidade,
            responsavel: quemRecebeu
        });
        produtoExistente.dataRecebimento = dataRecebimento;
        produtoExistente.quemRecebeu = quemRecebeu;
        alert(`Produto ${nome} atualizado com sucesso!`);
    } else {
        // Gerar ID sequencial
        const novoId = gerarIdSequencial();

        const novoProduto = {
            id: novoId,
            nome: nome.trim(),
            marca,
            quantidade,
            dataRecebimento,
            quemRecebeu,
            historico: [{
                data: dataRecebimento,
                quantidade,
                responsavel: quemRecebeu
            }]
        };
        produtos.push(novoProduto);
        alert(`Produto ${nome} cadastrado com sucesso!`);
    }

    // Salvar produtos no localStorage para persistência
    localStorage.setItem('produtos', JSON.stringify(produtos));

    atualizarListaProdutos(); // Atualizar a lista de produtos na tela
}

// Função para atualizar a lista de produtos na página
function atualizarListaProdutos() {
    const listaProdutos = document.getElementById('produtos-lista');
    listaProdutos.innerHTML = ''; // Limpar a lista atual

    produtos.forEach(produto => {
        const produtoItem = document.createElement('div');
        produtoItem.classList.add('produto-item');

        const nomeElemento = document.createElement('div');
        nomeElemento.classList.add('produto-nome');
        nomeElemento.textContent = produto.nome;

        const quantidadeElemento = document.createElement('div');
        quantidadeElemento.classList.add('produto-quantidade');
        quantidadeElemento.textContent = `Quantidade: ${produto.quantidade}`;

        produtoItem.appendChild(nomeElemento);
        produtoItem.appendChild(quantidadeElemento);

        listaProdutos.appendChild(produtoItem);
    });
}

// Função para filtrar produtos e mostrar as sugestões
function mostrarSugestoes(event) {
    const nomeInput = event.target.value.trim().toLowerCase();
    const sugestoesDiv = document.getElementById('sugestoes');
    sugestoesDiv.innerHTML = ''; // Limpar as sugestões anteriores

    if (nomeInput.length > 0) {
        const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(nomeInput));

        if (produtosFiltrados.length > 0) {
            sugestoesDiv.style.display = 'block';
            produtosFiltrados.forEach(produto => {
                const sugestaoItem = document.createElement('div');
                sugestaoItem.classList.add('sugestao-item');
                sugestaoItem.textContent = produto.nome;

                sugestaoItem.addEventListener('click', function () {
                    document.getElementById('nomeProduto').value = produto.nome;
                    sugestoesDiv.style.display = 'none';
                });

                sugestoesDiv.appendChild(sugestaoItem);
            });
        }
    } else {
        sugestoesDiv.style.display = 'none';
    }
}

// Evento de envio do formulário de cadastro
document.getElementById('formCadastroProduto').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nomeProduto').value;
    const marca = document.getElementById('marcaProduto').value;
    const quantidade = parseInt(document.getElementById('quantidadeProduto').value);
    const dataRecebimento = document.getElementById('dataRecebimento').value;
    const quemRecebeu = document.getElementById('quemRecebeu').value;

    if (nome && marca && quantidade && dataRecebimento && quemRecebeu) {
        cadastrarProduto(nome, marca, quantidade, dataRecebimento, quemRecebeu);

        // Limpar os campos após cadastro
        document.getElementById('nomeProduto').value = '';
        document.getElementById('marcaProduto').value = '';
        document.getElementById('quantidadeProduto').value = '';
        document.getElementById('dataRecebimento').value = '';
        document.getElementById('quemRecebeu').value = '';
        document.getElementById('sugestoes').style.display = 'none';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

// Evento para mostrar sugestões enquanto digita
document.getElementById('nomeProduto').addEventListener('input', mostrarSugestoes);

// Ao carregar a página, atualize a lista de produtos
document.addEventListener('DOMContentLoaded', atualizarListaProdutos);
