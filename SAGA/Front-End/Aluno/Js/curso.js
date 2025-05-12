document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("courseTableBody");

    const data = [
        { materia: "Sistemas Web", cargaHoraria: "100 Horas", professor: "José Silva Souza" },
        { materia: "Sistemas Web", cargaHoraria: "100 Horas", professor: "José Silva Souza" },
        { materia: "Sistemas Web", cargaHoraria: "100 Horas", professor: "José Silva Souza" },
        { materia: "Sistemas Web", cargaHoraria: "100 Horas", professor: "José Silva Souza" },
        { materia: "Sistemas Web", cargaHoraria: "100 Horas", professor: "José Silva Souza" },
        { materia: "Sistemas Web", cargaHoraria: "100 Horas", professor: "José Silva Souza" }
    ];

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.materia}</td>
            <td>${item.cargaHoraria}</td>
            <td>${item.professor}</td>
        `;
        tableBody.appendChild(row);
    });
});
