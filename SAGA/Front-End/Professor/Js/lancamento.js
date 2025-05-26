document.addEventListener("DOMContentLoaded", async () => {
    const tabela = document.getElementById("tabelaLancamento");
    const btnLancar = document.querySelector(".btn-lancar");
    const selectModulo = document.getElementById("selectModulo");
    const selectMateria = document.getElementById("selectMateria");

    let alunos = [];
    let id_turma = "";
    let id_professor = "";
    let id_materia = "";

    const token = localStorage.getItem("token");
    const id_user = localStorage.getItem("userId");

    // Busca o id_professor pelo id_user
    async function buscarIdProfessor() {
        if (!id_user) return "";
        const resp = await fetch(`http://localhost:8081/professor/user/${id_user}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) {
            const prof = await resp.json();
            return prof.id_professor;
        }
        return "";
    }

    // Popula o select de módulos (turmas)
    async function popularModulos() {
        const resp = await fetch(`http://localhost:8081/prof/turmas/${id_professor}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) {
            const turmas = await resp.json();
            selectModulo.innerHTML = `<option value="">Selecione o Módulo</option>`;
            turmas.forEach(turma => {
                selectModulo.innerHTML += `<option value="${turma.id_turma}">${turma.nome}</option>`;
            });
        }
    }

    // Popula o select de matérias conforme o professor
    async function popularMaterias() {
        const resp = await fetch(`http://localhost:8081/prof/materias/${id_professor}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) {
            const materias = await resp.json();
            selectMateria.innerHTML = `<option value="">Selecione a Matéria</option>`;
            materias.forEach(materia => {
                selectMateria.innerHTML += `<option value="${materia.id_materia}">${materia.nome}</option>`;
            });
        }
    }

    // Busca alunos da turma selecionada
    async function buscarAlunos() {
        if (!id_turma || !id_materia) {
            tabela.innerHTML = "";
            return;
        }
        const resp = await fetch(`http://localhost:8081/prof/alunos-turma/${id_turma}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alunos = resp.ok ? await resp.json() : [];
        renderTabela();
    }

    // Renderiza a tabela de alunos com inputs de notas
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

    // Eventos de mudança nos selects
    selectModulo.addEventListener("change", () => {
        id_turma = selectModulo.value;
        buscarAlunos();
    });
    selectMateria.addEventListener("change", () => {
        id_materia = selectMateria.value;
        buscarAlunos();
    });

    // Lançar notas
    btnLancar.addEventListener("click", async () => {
        if (!id_professor || !id_turma || !id_materia) {
            alert("Selecione módulo e matéria!");
            return;
        }
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

    // Inicialização: buscar id_professor antes de popular selects
    id_professor = await buscarIdProfessor();
    if (!id_professor) {
        alert("Usuário não é professor ou não está cadastrado corretamente!");
        return;
    }
    await popularModulos();
    await popularMaterias();
});
