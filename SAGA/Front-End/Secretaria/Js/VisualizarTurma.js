    document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("ListaUsuariosTableBody");

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

function searchFunction() {
    const input = document.getElementById("listInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("listTable");
    const trs = table.tBodies[0].getElementsByTagName("tr");

    for (let i = 0; i < trs.length; i++) {
        const tds = trs[i].getElementsByTagName("td");
        trs[i].style.display = "none";

        // Verifica nas duas primeiras colunas (matrícula e nome)
        for (let j = 0; j < 3; j++) {
            if (tds[j] && tds[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                trs[i].style.display = "";
                break;
            }
        }
    }
}