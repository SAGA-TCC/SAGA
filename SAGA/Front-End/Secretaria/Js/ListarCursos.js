document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("ListaCursosTableBody");

    const data = [
        { codigo: "0", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "1", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "2", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "3", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "4", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "5", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" }
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

// função de pesquisa
function searchFunction() {
    var input = document.getElementById("listInput");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("listTable");
    var trs = table.tBodies[0].getElementsByTagName("tr");

    // Loop through rows
    for (var i = 0; i < trs.length; i++) {
        var tds = trs[i].getElementsByTagName("td");
        trs[i].style.display = "none";

        for (var j = 0; j < 2; j++) { // verifica as primeiras duas colunas 
            if (tds[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                trs[i].style.display = ""; // mostra as colunas se forem encontradas
                break; 
            }
        }
    }
}
