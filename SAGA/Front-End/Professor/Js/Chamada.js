document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("listaChamadaBody");
    const turmaHeader = document.getElementById("turmaHeader");

    // Recupera token e id_user do localStorage
    const token = localStorage.getItem("token");
    const id_user = localStorage.getItem("userId");    if (!token || !id_user) {
        alert("Usuário não autenticado!");
        window.location.href = "../../Login/Login.html";
        return;
    }

    // Busca o id_professor pelo id_user
    let id_professor = null;
    try {
        const resp = await fetch(`http://localhost:8081/professor/user/${id_user}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error();
        const prof = await resp.json();
        id_professor = prof.id_professor;
    } catch (e) {
        alert("Erro ao buscar professor.");
        return;
    }

    if (!id_professor) {
        alert("Professor não encontrado.");
        return;
    }

    // Busca as turmas do professor
    let turmas = [];
    try {
        const turmasResp = await fetch(`http://localhost:8081/prof/turmas/${id_professor}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        turmas = await turmasResp.json();
    } catch (e) {
        alert("Erro ao buscar turmas.");
        return;
    }

    // Busca as matérias do professor
    let materias = [];
    try {
        const materiasResp = await fetch(`http://localhost:8081/prof/materias/${id_professor}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        materias = await materiasResp.json();
    } catch (e) {
        alert("Erro ao buscar matérias.");
        return;
    }

    // Limpa o cabeçalho e monta o novo
    if (turmaHeader) turmaHeader.textContent = "Chamada";

    // Monta a tabela cruzando turmas e matérias
    tableBody.innerHTML = ""; // Limpa antes de montar

    // Adiciona o cabeçalho da tabela conforme a imagem
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Módulo</th>
            <th>Matéria</th>
            <th>Total de aulas Semanais</th>
            <th></th>
        </tr>
    `;
    tableBody.parentNode.insertBefore(thead, tableBody);

    let encontrou = false;
    turmas.forEach(turma => {
        materias.forEach(materia => {
            if (materia.id_curso === turma.id_curso) {
                encontrou = true;
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${turma.curso.nome}</td>
                    <td>${materia.nome}</td>
                    <td>${materia.ch_total}</td>
                    <td>
                        <button class="btn-selecionar" 
                            data-id-turma="${turma.id_turma}" 
                            data-id-materia="${materia.id_materia}">
                            Selecionar
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        });
    });

    if (!encontrou) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="4" style="text-align:center;">Nenhuma turma/matéria encontrada.</td>`;
        tableBody.appendChild(row);
    }

    // Evento do botão Selecionar
    tableBody.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-selecionar")) {
            const id_turma = e.target.getAttribute("data-id-turma");
            const id_materia = e.target.getAttribute("data-id-materia");
            localStorage.setItem("id_turma_selecionada", id_turma);
            localStorage.setItem("id_materia_selecionada", id_materia);
            window.location.href = "Chamada2.html";
        }
    });
});
