document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("ListaDisciplinaTableBody");

    const data = [
        { matricula: "0", nome: "José Silva Souza", email: "jose.silva.souza@email.example.com.br", dt_cadastro: "01/01/2025" },
        { matricula: "1", nome: "José Silva Souza", email: "jose.silva.souza@email.example.com.br", dt_cadastro: "01/01/2025" },
        { matricula: "2", nome: "José Silva Souza", email: "jose.silva.souza@email.example.com.br", dt_cadastro: "01/01/2025" },
        { matricula: "3", nome: "José Silva Souza", email: "jose.silva.souza@email.example.com.br", dt_cadastro: "01/01/2025" },
        { matricula: "4", nome: "José Silva Souza", email: "jose.silva.souza@email.example.com.br", dt_cadastro: "01/01/2025" },
        { matricula: "5", nome: "José Silva Souza", email: "jose.silva.souza@email.example.com.br", dt_cadastro: "01/01/2025" }
    ];

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.matricula}</td>
            <td>${item.nome}</td>
            <td>${item.email}</td>
            <td>${item.dt_cadastro}</td>
            <td><button>Editar</button></td>
            <td><button>Excluir</button></td>
        `;
        tableBody.appendChild(row);
    });
});

function showDetails(matricula) {
    // Aqui você pode tratar a ação do botão, por exemplo, redirecionar para uma página de detalhes.
    console.log("Matrícula do usuário: " + matricula);
}
