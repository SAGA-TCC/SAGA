document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("turmaTableBody");

    const dados = [
        { modulo: "Informática", materia: "Lógica de Programação(LP)", aulas: 3, carga: "900 Horas" },
        { modulo: "Administração", materia: "Marketing", aulas: 2, carga: "900 Horas" },
        { modulo: "Gastronomia", materia: "Panificação e Confeitaria", aulas: 1, carga: "900 Horas" },
        { modulo: "Informática", materia: "Lógica de Programação(LP)", aulas: 3, carga: "900 Horas" },
        { modulo: "Administração", materia: "Marketing", aulas: 2, carga: "900 Horas" },
        { modulo: "Gastronomia", materia: "Panificação e Confeitaria", aulas: 1, carga: "900 Horas" },
    ];

    dados.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.modulo}</td>
            <td>${item.materia}</td>
            <td>${item.aulas}</td>
            <td>${item.carga}</td>
        `;
        tableBody.appendChild(row);
    });
});
