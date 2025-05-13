document.addEventListener("DOMContentLoaded", () => {
    const selectProduto = document.getElementById("produto");
    const formSaida = document.getElementById("formSaida");

    // Pegar produtos do localStorage
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    console.log("Produtos carregados:", produtos);

    // Preencher o select de produtos
    produtos.forEach(produto => {
        const option = document.createElement("option");
        option.value = String(produto.id); // Garante que seja string
        option.textContent = produto.nome;
        selectProduto.appendChild(option);
    });

    // Lidar com envio do formulário
    formSaida.addEventListener("submit", (e) => {
        e.preventDefault();

        const produtoId = document.getElementById("produto").value; // string
        const quantidade = parseInt(document.getElementById("quantidade").value, 10);
        const dataRetirada = document.getElementById("data_retirada").value;
        const destino = document.getElementById("destino").value.trim();
        const responsavel = document.getElementById("responsavel").value.trim();

        // Verificar se o produto existe (comparando como string)
        const produto = produtos.find(p => String(p.id) === produtoId);
        if (!produto) {
            alert("Produto inválido.");
            return;
        }

        // Verificar se há estoque suficiente
        if (quantidade > Number(produto.quantidade)) {
            alert(`Estoque insuficiente. Saldo disponível: ${produto.quantidade}`);
            return;
        }

        // Verificar se a data de retirada está preenchida
        if (!dataRetirada) {
            alert("A data de retirada é obrigatória.");
            return;
        }

        // Criar o objeto de saída
        const novaSaida = {
            id: Date.now(),
            produtoId: produto.id,
            produtoNome: produto.nome,
            quantidade,
            dataRetirada,
            destino,
            responsavel
        };

        // Atualizar o estoque do produto
        produto.quantidade -= quantidade;
        localStorage.setItem("produtos", JSON.stringify(produtos));

        // Salvar saída no localStorage
        const saidas = JSON.parse(localStorage.getItem("saidas")) || [];
        saidas.push(novaSaida);
        localStorage.setItem("saidas", JSON.stringify(saidas));

        alert("Saída registrada com sucesso!");
        formSaida.reset();
    });
});
