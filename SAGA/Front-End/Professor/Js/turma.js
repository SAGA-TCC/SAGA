document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("turmaTableBody");
    
    // Recuperar token e ID do professor do localStorage
    const token = localStorage.getItem('token');
    const professorId = localStorage.getItem('userId');

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
    
    try {
        // Mostrar um indicador de carregamento
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Carregando dados...</td></tr>';
        
        // Fazer a requisição para a API
        const response = await fetch(`http://localhost:8081/prof/turmas/${professorId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const turmas = await response.json();
        console.log('Turmas recebidas:', turmas);
        
        // Limpar o conteúdo da tabela antes de adicionar novas linhas
        tableBody.innerHTML = '';
        
        if (turmas.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhuma turma encontrada para este professor.</td></tr>';
            return;
        }
        
        // Para cada turma, crie uma linha na tabela
        turmas.forEach(turma => {
            const row = document.createElement("tr");
            
            // Extrair informações da turma
            const nomeCurso = turma.curso?.nome || 'N/A';
            const nomeTurma = turma.nome || 'N/A';
            const semestres = turma.semestres || 'N/A';
            const cargaHoraria = turma.curso?.ch_total || 'N/A';
            
            row.innerHTML = `
                <td>${nomeCurso}</td>
                <td>${nomeTurma}</td>
                <td>${semestres}</td>
                <td>${cargaHoraria} Horas</td>
            `;
              // Adicionar evento de clique para navegação ou ações adicionais
            row.addEventListener('click', () => {
                // Armazenar o ID da turma selecionada para uso em outras páginas
                localStorage.setItem('selectedTurmaId', turma.id_turma);
                // Armazenar informações adicionais para uso na página de detalhes
                localStorage.setItem('selectedTurmaNome', nomeTurma);
                localStorage.setItem('selectedCursoNome', nomeCurso);
                // Redirecionar para a página de chamada da turma
                window.location.href = "Chamada.html";
            });
            
            tableBody.appendChild(row);
        });
        
    } catch (error) {
        console.error("Erro ao buscar turmas:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Erro ao carregar dados: ${error.message}</td></tr>`;
    }
});