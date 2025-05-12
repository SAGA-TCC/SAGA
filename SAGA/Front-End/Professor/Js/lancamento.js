document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("tabelaLancamento");

    const alunos = [
        { numero: 1, nome: "Gabriel da Silva Oliveira", b1: "B", b2: "MB" },
        { numero: 2, nome: "Ana Clara Santos Ferreira", b1: "MB", b2: "MB" },
        { numero: 4, nome: "Mariana Costa Rodrigues", b1: "MB", b2: "B" },
        { numero: 3, nome: "Lucas Almeida Pereira", b1: "R", b2: "MB" },
        { numero: 4, nome: "João Pedro Moreira Souza", b1: "B", b2: "B" }
    ];

    alunos.forEach(aluno => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${aluno.numero}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.b1}</td>
            <td>${aluno.b2}</td>
        `;
        tabela.appendChild(row);
    });
});
