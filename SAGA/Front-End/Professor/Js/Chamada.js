document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("listaChamadaBody");

    const dadosChamadas = [
        { modulo: "Informática", materia: "Lógica de Programação (LP)", aulas: 3 },
        { modulo: "Administração", materia: "Marketing", aulas: 2 },
        { modulo: "Gastronomia", materia: "Panificação e Confeitaria", aulas: 1 },
        { modulo: "Informática", materia: "Redes de Computadores", aulas: 2 },
        { modulo: "Administração", materia: "Empreendedorismo", aulas: 3 },
        { modulo: "Gastronomia", materia: "Cozinha Brasileira", aulas: 2 }
    ];

    dadosChamadas.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.modulo}</td>
            <td>${item.materia}</td>
            <td>${item.aulas}</td>
            <td><button class="btn-selecionar">Selecionar</button></td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelectorAll(".btn-selecionar").forEach((botao, index) => {
        botao.addEventListener("click", function () {
            const materiaSelecionada = dadosChamadas[index].materia;
            console.log("Selecionado:", materiaSelecionada);
        });
    });
});
