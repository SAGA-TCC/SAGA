document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("Chamada2TableBody");
    const btnLancar = document.querySelector(".botao-lancar");
    const dataChamada = document.getElementById("dataChamada");
    const titulo = document.querySelector("h1.titulo-centralizado");
    
    // Definir a data atual como padrão no seletor de data
    const hoje = new Date();
    // Formatar a data no formato YYYY-MM-DD para o input date
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro é 0
    const dia = String(hoje.getDate()).padStart(2, '0');
    dataChamada.value = `${ano}-${mes}-${dia}`;

    const token = localStorage.getItem("token");
    const id_user = localStorage.getItem("userId");
    const id_turma = localStorage.getItem("id_turma_selecionada");
    const id_materia = localStorage.getItem("id_materia_selecionada");
    
    // Recuperar informações da turma e matéria para exibir no título
    const nomeTurma = localStorage.getItem("selectedTurmaNome") || "Turma";
    const nomeMateria = localStorage.getItem("selectedMateriaNome") || "Matéria";
    
    if (titulo) {
        titulo.textContent = `Chamada - ${nomeTurma} - ${nomeMateria}`;
    }

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
    }    // Busca alunos da turma
    let alunos = [];
    try {
        const resp = await fetch(`http://localhost:8081/prof/alunos/${id_turma}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error("Resposta não ok");
        alunos = await resp.json();
        console.log("Alunos carregados:", alunos);
    } catch (e) {
        console.error("Erro ao buscar alunos:", e);
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
                <button class="status-btn verde" data-status="P" data-id="${aluno.id_aluno}">P</button>
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
        // Verificar se a data foi selecionada
        if (!dataChamada.value) {
            alert("Por favor, selecione uma data para a chamada.");
            return;
        }
        
        try {
            console.log("Iniciando lançamento de chamada...");
            
            // Monta array de presenças
            const presencas = [];
            tableBody.querySelectorAll(".status-btn").forEach(btn => {
                presencas.push({
                    id_aluno: btn.dataset.id,
                    presente: btn.dataset.status === "P"
                });
            });            if (presencas.length === 0) {
                alert("Nenhum aluno encontrado para lançar presença.");
                return;
            }

            console.log("Dados para envio:", {
                id_professor,
                id_turma,
                data: dataChamada.value,
                presencas
            });

            // Envia chamada para o backend
            const resp = await fetch("http://localhost:8081/prof/chamada", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_professor,
                    id_turma,
                    data: dataChamada.value,
                    presencas
                })
            });

            const result = await resp.json();
            
            if (resp.ok) {
                alert("Chamada lançada com sucesso!");
                window.location.href = "Chamada.html";
            } else {
                console.error("Erro retornado pela API:", result);
                alert(result.erro || "Erro ao lançar chamada.");
            }
        } catch (e) {
            console.error("Erro ao lançar chamada:", e);
            alert("Erro ao lançar chamada: " + (e.message || "Erro desconhecido"));
        }    });
});
