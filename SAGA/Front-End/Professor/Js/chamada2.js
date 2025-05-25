document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("Chamada2TableBody");
    const btnLancar = document.querySelector(".botao-lancar");

    const token = localStorage.getItem("token");
    const id_user = localStorage.getItem("userId");
    const id_turma = localStorage.getItem("id_turma_selecionada");
    const id_materia = localStorage.getItem("id_materia_selecionada");

    if (!token || !id_user || !id_turma || !id_materia) {
        alert("Dados de chamada não encontrados!");
        window.location.href = "Chamada.html";
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

    // Busca alunos da turma
    let alunos = [];
    try {
        const resp = await fetch(`http://localhost:8081/prof/alunos/${id_turma}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alunos = await resp.json();
    } catch (e) {
        alert("Erro ao buscar alunos da turma.");
        return;
    }

    // Monta a tabela
    alunos.forEach((aluno, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td>${aluno.nome}</td>
            <td>
                <button class="status-btn verde" data-status="P">P</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Alterna status ao clicar
    tableBody.querySelectorAll(".status-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            if (btn.dataset.status === "P") {
                btn.dataset.status = "F";
                btn.textContent = "F";
                btn.classList.remove("verde");
                btn.classList.add("vermelho");
            } else {
                btn.dataset.status = "P";
                btn.textContent = "P";
                btn.classList.remove("vermelho");
                btn.classList.add("verde");
            }
        });
    });

    // Lançar presença
    btnLancar.addEventListener("click", async function () {
        // Monta array de presenças
        const presencas = [];
        tableBody.querySelectorAll("tr").forEach((row, idx) => {
            const btn = row.querySelector(".status-btn");
            presencas.push({
                id_aluno: alunos[idx].id_aluno,
                presente: btn.dataset.status === "P"
            });
        });

        // Envia chamada para o backend
        try {
            const resp = await fetch("http://localhost:8081/prof/chamada", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_professor,
                    id_turma,
                    data: new Date().toISOString(),
                    presencas
                })
            });
            const result = await resp.json();
            if (resp.ok) {
                alert("Chamada lançada com sucesso!");
                window.location.href = "Chamada.html";
            } else {
                alert(result.erro || "Erro ao lançar chamada.");
            }
        } catch (e) {
            alert("Erro ao lançar chamada.");
        }
    });
});
