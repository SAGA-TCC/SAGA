document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("listaChamadaBody");

    // Recupera o token e id_user do localStorage (ajuste conforme seu login)
    const token = localStorage.getItem("token");
    const id_user = localStorage.getItem("userId");

    if (!token || !id_user) {
        alert("Usuário não autenticado!");
        window.location.href = "../../index.html";
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
    const turmasResp = await fetch(`http://localhost:8081/prof/turmas/${id_professor}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const turmas = await turmasResp.json();

    // Busca as matérias do professor
    const materiasResp = await fetch(`http://localhost:8081/prof/materias/${id_professor}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const materias = await materiasResp.json();

    // Monta a tabela cruzando turmas e matérias
    turmas.forEach(turma => {
        materias.forEach(materia => {
            if (materia.id_curso === turma.id_curso) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${turma.curso.nome}</td>
                    <td>${materia.nome}</td>
                    <td>${materia.ch_total}</td>
                    <td><button class="btn-selecionar" 
                        data-id-turma="${turma.id_turma}" 
                        data-id-materia="${materia.id_materia}">Selecionar</button></td>
                `;
                tableBody.appendChild(row);
            }
        });
    });

    document.querySelectorAll(".btn-selecionar").forEach((botao) => {
        botao.addEventListener("click", function () {
            // Salva os dados da seleção
            localStorage.setItem("id_turma_selecionada", botao.getAttribute("data-id-turma"));
            localStorage.setItem("id_materia_selecionada", botao.getAttribute("data-id-materia"));
            window.location.href = "../Page/Chamada2.html";
        });
    });
});
