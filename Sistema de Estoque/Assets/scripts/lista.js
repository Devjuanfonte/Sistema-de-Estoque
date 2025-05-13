window.onload = function() {
    exibirProdutos();
};

function exibirProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    const saidas = JSON.parse(localStorage.getItem('saidas') || '[]');
    const listaDiv = document.getElementById('produtos-lista');
    listaDiv.innerHTML = ''; // Limpa a lista antes de preencher

    if (produtos.length === 0) {
        listaDiv.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        return;
    }

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto-item');
        
        // Nome e quantidade do produto
        const nomeElement = document.createElement('span');
        nomeElement.classList.add('produto-nome');
        nomeElement.textContent = produto.nome;
        
        const quantidadeElement = document.createElement('span');
        quantidadeElement.classList.add('produto-quantidade');
        quantidadeElement.textContent = `Quantidade: ${produto.quantidade}`;

        // Cria o botão para expandir
        const expandButton = document.createElement('button');
        expandButton.textContent = "Ver Histórico";
        expandButton.onclick = function() {
            toggleHistorico(produtoDiv, produto.historico, saidas.filter(s => s.produtoId === produto.id));
        };

        produtoDiv.appendChild(nomeElement);
        produtoDiv.appendChild(quantidadeElement);
        produtoDiv.appendChild(expandButton);

        listaDiv.appendChild(produtoDiv);
    });
}

function toggleHistorico(produtoDiv, entradas, saidas) {
    let historicoDiv = produtoDiv.querySelector('.historico');

    if (!historicoDiv) {
        historicoDiv = document.createElement('div');
        historicoDiv.classList.add('historico');

        // Entradas
        const entradaTitulo = document.createElement('h4');
        entradaTitulo.textContent = 'Histórico de Entradas:';
        historicoDiv.appendChild(entradaTitulo);

        if (entradas.length > 0) {
            entradas.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('historico-entry');
                entryDiv.textContent = `Data: ${entry.data} | Quantidade: +${entry.quantidade} | Responsável: ${entry.responsavel}`;
                historicoDiv.appendChild(entryDiv);
            });
        } else {
            historicoDiv.innerHTML += '<p>Nenhuma entrada registrada.</p>';
        }

        // Saídas
        const saidaTitulo = document.createElement('h4');
        saidaTitulo.textContent = 'Histórico de Saídas:';
        historicoDiv.appendChild(saidaTitulo);

        if (saidas.length > 0) {
            saidas.forEach(saida => {
                const saidaDiv = document.createElement('div');
                saidaDiv.classList.add('historico-entry');
                saidaDiv.textContent = `Data: ${saida.dataRetirada} | Quantidade: -${saida.quantidade} | Destino: ${saida.destino} | Responsável: ${saida.responsavel}`;
                historicoDiv.appendChild(saidaDiv);
            });
        } else {
            historicoDiv.innerHTML += '<p>Nenhuma saída registrada.</p>';
        }

        produtoDiv.appendChild(historicoDiv);
    } else {
        produtoDiv.removeChild(historicoDiv);
    }
}
