document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("tabelaLancamento");
    const btnLancar = document.querySelector(".btn-lancar");
    const selectModulo = document.querySelectorAll(".select-group select")[0];
    const selectMateria = document.querySelectorAll(".select-group select")[1];

    let alunos = [];
    let id_turma = ""; // Defina conforme o contexto do professor logado
    let id_professor = ""; // Defina conforme o contexto do professor logado
    let id_materia = ""; // Defina conforme a matéria selecionada

    // Exemplo: buscar id_professor e id_turma do localStorage/session ou API

    // Função para buscar alunos da turma
    async function buscarAlunos() {
        if (!id_turma) return;
        const token = localStorage.getItem("token");
        const resp = await fetch(`http://localhost:8081/prof/alunos-turma/${id_turma}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alunos = await resp.json();
        renderTabela();
    }

    // Função para renderizar tabela com inputs
    function renderTabela() {
        tabela.innerHTML = "";
        alunos.forEach((aluno, idx) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${idx + 1}</td>
                <td>${aluno.nome}</td>
                <td><input type="number" min="0" max="10" step="0.1" class="nota1" data-id="${aluno.id_user}"></td>
                <td><input type="number" min="0" max="10" step="0.1" class="nota2" data-id="${aluno.id_user}"></td>
            `;
            tabela.appendChild(row);
        });
    }

    // Ao mudar módulo ou matéria, buscar alunos
    selectModulo.addEventListener("change", () => {
        // Atualize id_turma conforme seleção
        // id_turma = ...;
        buscarAlunos();
    });
    selectMateria.addEventListener("change", () => {
        // Atualize id_materia conforme seleção
        // id_materia = ...;
        buscarAlunos();
    });

    // Lançar notas
    btnLancar.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        // 1º Bimestre
        const notas1 = Array.from(document.querySelectorAll(".nota1")).map(input => ({
            id_aluno: input.dataset.id,
            valor: parseFloat(input.value)
        })).filter(n => !isNaN(n.valor));
        // 2º Bimestre
        const notas2 = Array.from(document.querySelectorAll(".nota2")).map(input => ({
            id_aluno: input.dataset.id,
            valor: parseFloat(input.value)
        })).filter(n => !isNaN(n.valor));

        // Envia para o back-end (um request para cada bimestre)
        if (notas1.length > 0) {
            await fetch("http://localhost:8081/prof/lancarNotas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_professor,
                    id_turma,
                    id_materia,
                    tipo_avaliacao: "Prova",
                    bimestre: "1º Bimestre",
                    notas: notas1
                })
            });
        }
        if (notas2.length > 0) {
            await fetch("http://localhost:8081/prof/lancarNotas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_professor,
                    id_turma,
                    id_materia,
                    tipo_avaliacao: "Prova",
                    bimestre: "2º Bimestre",
                    notas: notas2
                })
            });
        }
        alert("Notas lançadas com sucesso!");
    });

    // Inicialização
    // Defina id_turma, id_professor, id_materia conforme contexto do professor logado
    // buscarAlunos();
});
