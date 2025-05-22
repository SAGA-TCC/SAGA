document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('editarTurmaForm');
    const cursosSelect = document.getElementById('cursosSelect');
    const params = new URLSearchParams(window.location.search);
    const turmaId = params.get('id');

    // Elementos do formulário
    const nomeTurma = document.getElementById('nomeTurma');
    const dataInicio = document.getElementById('dataInicio');
    const semestres = document.getElementById('semestres');

    // Função para carregar cursos
    async function carregarCursos() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Usuário não autenticado. Por favor, faça login novamente.');
                window.location.href = '../Login/Login.html';
                return;
            }

            const response = await fetch('http://localhost:8081/sec/listarCursos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar cursos');
            }

            const cursos = await response.json();
            cursosSelect.innerHTML = '<option value="">Selecione um curso...</option>';
            cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id_curso;
                option.textContent = curso.nome;
                cursosSelect.appendChild(option);
            });

            return cursos;
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar cursos. Por favor, tente novamente.');
        }
    }

    // Função para carregar dados da turma
    async function carregarDadosTurma() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/sec/Turma/listar', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar dados da turma');
            }

            const turmas = await response.json();
            const turma = turmas.find(t => t.id_turma === turmaId);

            if (!turma) {
                alert('Turma não encontrada');
                window.location.href = 'ListarTurmas.html';
                return;
            }

            // Preencher o formulário
            nomeTurma.value = turma.nome;
            dataInicio.value = turma.dt_inicio.split('T')[0]; // Formata a data para YYYY-MM-DD
            semestres.value = turma.semestres;
            cursosSelect.value = turma.id_curso;

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar dados da turma. Por favor, tente novamente.');
        }
    }

    // Função para salvar alterações
    async function salvarAlteracoes(event) {
        event.preventDefault();

        if (!nomeTurma.value || !dataInicio.value || !semestres.value || !cursosSelect.value) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const turmaData = {
                nome: nomeTurma.value,
                dt_inicio: dataInicio.value,
                semestres: parseInt(semestres.value),
                id_curso: cursosSelect.value
            };

            const response = await fetch(`http://localhost:8081/sec/Turma/editar/${turmaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(turmaData)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar turma');
            }

            alert('Turma atualizada com sucesso!');
            window.location.href = 'ListarTurmas.html';
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao atualizar turma. Por favor, tente novamente.');
        }
    }

    // Adicionar listener para o formulário
    form.addEventListener('submit', salvarAlteracoes);

    // Carregar dados iniciais
    await carregarCursos();
    await carregarDadosTurma();
});
