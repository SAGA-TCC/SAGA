document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector(".tabela-chamada tbody");

    const alunos = [
        { numero: 1, nome: "Gabriel da Silva Oliveira", status: "P" },
        { numero: 2, nome: "Ana Clara Santos Ferreira", status: "P" },
        { numero: 3, nome: "Lucas Almeida Pereira", status: "F" },
        { numero: 4, nome: "Mariana Costa Rodrigues", status: "P" },
        { numero: 5, nome: "João Pedro Moreira Souza", status: "T" },
        { numero: 6, nome: "Laura Fernandes Lima", status: "P" },
        { numero: 7, nome: "Carlos Eduardo Santos", status: "F" },
        { numero: 8, nome: "Isabela Gomes Rocha", status: "T" },
        { numero: 9, nome: "Rafael Costa Mendes", status: "P" },
        { numero: 10, nome: "Beatriz Souza Azevedo", status: "P" }
    ];

    alunos.forEach(aluno => {
        const row = document.createElement("tr");

        let statusClass = "";
        if (aluno.status === "P") {
            statusClass = "verde";
        } else if (aluno.status === "F") {
            statusClass = "vermelho";
        } else if (aluno.status === "T") {
            statusClass = "amarelo";
        }

        row.innerHTML = `
            <td>${aluno.numero}</td>
            <td>${aluno.nome}</td>
            <td><span class="status ${statusClass}">${aluno.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
});
