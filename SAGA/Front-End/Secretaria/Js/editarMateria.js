document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('disciplinaForm');
    const params = new URLSearchParams(window.location.search);
    const materiaId = params.get('id');

    // Elementos do formulário
    const nomeDisciplina = document.getElementById('nomeDisciplina');
    const cargaHoraria = document.getElementById('cargaHorariaDisc');
    const serie = document.getElementById('serieDisciplina');
    const frequencia = document.getElementById('frequenciaDisciplina');
    const descricao = document.getElementById('descricaoDisciplina');
    const cursoDisciplina = document.getElementById('cursoDisciplina');

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
            cursoDisciplina.innerHTML = '<option value="">Selecione um curso...</option>';
            cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id_curso;
                option.textContent = curso.nome;
                cursoDisciplina.appendChild(option);
            });

            return cursos;
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar cursos. Por favor, tente novamente.');
        }
    }

    // Função para carregar dados da matéria
    async function carregarDadosMateria() {
        try {
            const token = localStorage.getItem('token');
            const cursos = await carregarCursos();
            
            // Encontrar a matéria no curso correspondente
            let materiaEncontrada = null;
            for (const curso of cursos) {
                const materia = curso.materias.find(m => m.id_materia === materiaId);
                if (materia) {
                    materiaEncontrada = materia;
                    cursoDisciplina.value = curso.id_curso;
                    break;
                }
            }

            if (!materiaEncontrada) {
                alert('Matéria não encontrada');
                window.location.href = 'ListarMaterias.html';
                return;
            }

            // Preencher o formulário
            nomeDisciplina.value = materiaEncontrada.nome;
            cargaHoraria.value = materiaEncontrada.ch_total;
            frequencia.value = materiaEncontrada.freq_min;
            descricao.value = materiaEncontrada.descricao;
            
            // Desabilitar a mudança de curso
            cursoDisciplina.disabled = true;

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar dados da matéria. Por favor, tente novamente.');
        }
    }

    // Função para salvar alterações
    async function salvarAlteracoes(event) {
        event.preventDefault();

        if (!nomeDisciplina.value || !cargaHoraria.value || !frequencia.value || !descricao.value) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const materiaData = {
                nome: nomeDisciplina.value,
                descricao: descricao.value,
                ch_total: cargaHoraria.value.toString(),
                freq_min: frequencia.value.toString()
            };

            const response = await fetch(`http://localhost:8081/sec/editarMateria/${materiaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(materiaData)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar matéria');
            }

            alert('Matéria atualizada com sucesso!');
            window.location.href = 'ListarMaterias.html';
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao atualizar matéria. Por favor, tente novamente.');
        }
    }

    // Alterar o texto do botão de submit
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Salvar Alterações';

    // Adicionar listener para o formulário
    form.addEventListener('submit', salvarAlteracoes);

    // Carregar dados iniciais
    await carregarDadosMateria();
});