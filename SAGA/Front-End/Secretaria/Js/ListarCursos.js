document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("ListaCursosTableBody");

    const data = [
        { codigo: "0", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025"},
        { codigo: "1", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025"},
        { codigo: "2", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025"},
        { codigo: "3", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025"},
        { codigo: "4", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025"},
        { codigo: "5", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025"}
    ];

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.codigo}</td>
            <td>${item.nomeCurso}</td>
            <td>${item.dt_cadas}</td>
            <td><button>Editar</button></td>
            <td><button>Excluir</button></td>
        `;
        tableBody.appendChild(row);
    });
});

