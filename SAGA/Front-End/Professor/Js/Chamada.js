document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("listaChamadaBody");
    const turmaHeader = document.getElementById("turmaHeader");
    
    // Recuperar token, ID do professor e ID da turma selecionada do localStorage
    const token = localStorage.getItem('token');
    const professorId = localStorage.getItem('userId');
    const turmaId = localStorage.getItem('selectedTurmaId');
    const turmaNome = localStorage.getItem('selectedTurmaNome');
    const cursoNome = localStorage.getItem('selectedCursoNome');

<<<<<<< HEAD
    if (!token) {
        alert('Usuário não autenticado. Por favor, faça login novamente.');
        window.location.href = '../../Login/Login.html';
        return;
    }

    if (!professorId) {
        alert('ID do professor não encontrado. Por favor, faça login novamente.');
        window.location.href = '../../Login/Login.html';
        return;
    }
    
    if (!turmaId) {
        alert('Nenhuma turma selecionada. Por favor, selecione uma turma primeiro.');
        window.location.href = 'Turma.html';
        return;
    }
    
    // Atualizar o cabeçalho da página com informações da turma
    if (turmaHeader && turmaNome && cursoNome) {
        turmaHeader.textContent = `Chamada - ${turmaNome} (${cursoNome})`;
    }
    
    try {
        // Mostrar um indicador de carregamento
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Carregando alunos...</td></tr>';
        
        // Buscar alunos da turma
        const alunosResponse = await fetch(`http://localhost:8081/prof/alunos/${turmaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
=======
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
>>>>>>> e11e978f1745f00b360dc57a451815aa0d719024
        });
        
        if (!alunosResponse.ok) {
            throw new Error(`HTTP error! Status: ${alunosResponse.status}`);
        }
        
        const alunos = await alunosResponse.json();
        console.log('Alunos recebidos:', alunos);
        
        // Limpar o conteúdo da tabela
        tableBody.innerHTML = '';
        
        if (alunos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum aluno encontrado nesta turma.</td></tr>';
            return;
        }
        
        // Inserir data atual no formato Brasil (DD/MM/YYYY)
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR');
        
        const dataRow = document.createElement("tr");
        dataRow.innerHTML = `<td colspan="4" style="text-align: center; font-weight: bold;">Data: ${dataFormatada}</td>`;
        tableBody.appendChild(dataRow);
        
        // Para cada aluno, crie uma linha na tabela
        alunos.forEach(aluno => {
            const row = document.createElement("tr");
            row.classList.add('aluno-row');
            row.dataset.alunoId = aluno.id;
            
            row.innerHTML = `
                <td>${aluno.nome}</td>
                <td>
                    <div class="presente-ausente">
                        <button class="btn-presente" data-presente="true">Presente</button>
                        <button class="btn-ausente" data-presente="false">Ausente</button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Adicionar botão de salvar chamada
        const salvarRow = document.createElement("tr");
        salvarRow.innerHTML = `
            <td colspan="4" style="text-align: center; padding-top: 20px;">
                <button id="btn-salvar-chamada" class="btn-salvar">Salvar Chamada</button>
            </td>
        `;
        tableBody.appendChild(salvarRow);
        
        // Adicionar evento de clique nos botões de presença
        document.querySelectorAll('.btn-presente, .btn-ausente').forEach(botao => {
            botao.addEventListener('click', function() {
                const row = this.closest('.aluno-row');
                row.querySelectorAll('.btn-presente, .btn-ausente').forEach(btn => {
                    btn.classList.remove('selecionado');
                });
                this.classList.add('selecionado');
            });
        });
        
        // Adicionar evento de clique no botão salvar
        document.getElementById('btn-salvar-chamada').addEventListener('click', async function() {
            const presencas = [];
            let todasPresencasRegistradas = true;
            
            document.querySelectorAll('.aluno-row').forEach(row => {
                const alunoId = row.dataset.alunoId;
                const botaoSelecionado = row.querySelector('.btn-presente.selecionado, .btn-ausente.selecionado');
                
                if (botaoSelecionado) {
                    const presente = botaoSelecionado.dataset.presente === 'true';
                    presencas.push({
                        id_aluno: alunoId,
                        presente: presente
                    });
                } else {
                    todasPresencasRegistradas = false;
                }
            });
            
            if (!todasPresencasRegistradas) {
                alert('Por favor, marque presença ou ausência para todos os alunos.');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:8081/prof/chamada', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_professor: professorId,
                        id_turma: turmaId,
                        data: new Date().toISOString(),
                        presencas: presencas
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const result = await response.json();
                alert('Chamada realizada com sucesso!');
                console.log('Resultado:', result);
                
                // Redirecionar para a página de turmas após salvar
                window.location.href = 'Turma.html';
                
            } catch (error) {
                console.error('Erro ao salvar chamada:', error);
                alert(`Erro ao salvar chamada: ${error.message}`);
            }
        });
        
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Erro ao carregar alunos: ${error.message}</td></tr>`;
    }
});
