document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("turmaTableBody");
    
    // Recuperar token do localStorage (assumindo que foi armazenado após login)
    const token = localStorage.getItem('token');
    const professorId = localStorage.getItem('userId');

    
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
        
        // Limpar o conteúdo da tabela antes de adicionar novas linhas
        tableBody.innerHTML = '';
        
        if (turmas.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhuma turma encontrada para este professor.</td></tr>';
            return;
        }
        
        // Para cada turma, crie uma linha na tabela
        turmas.forEach(turma => {
            const row = document.createElement("tr");
            
            // Baseado na resposta da API e no formato da tabela
            row.innerHTML = `
                <td>${turma.curso?.nome || 'N/A'}</td>
                <td>${turma.nome || 'N/A'}</td>
                <td>${turma.aulas_semanais || 'N/A'}</td>
                <td>${turma.curso?.carga_horaria || 'N/A'} Horas</td>
            `;
            
            // Adicionar evento de clique para navegação ou ações adicionais
            row.addEventListener('click', () => {
                // Aqui você pode implementar a navegação para a página de detalhes da turma
                // ou qualquer outra ação que desejar quando o usuário clicar em uma turma
                localStorage.setItem('selectedTurmaId', turma.id);
                // window.location.href = "../Page/DetalhesTurma.html";
            });
            
            tableBody.appendChild(row);
        });
        
    } catch (error) {
        console.error("Erro ao buscar turmas:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Erro ao carregar dados: ${error.message}</td></tr>`;
    }
});