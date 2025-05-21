document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('disciplinaForm');
    const cursosSelect = document.getElementById('cursoDisciplina');

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
            
            // Limpa o select
            cursosSelect.innerHTML = '<option value="">Selecione um curso...</option>';
            
            // Adiciona os cursos ao select
            cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id_curso;
                option.textContent = curso.nome;
                cursosSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar cursos. Por favor, tente novamente.');
        }
    }

    // Função para cadastrar matéria
    async function cadastrarMateria(event) {
        event.preventDefault();

        const nomeDisciplina = document.getElementById('nomeDisciplina').value;
        const cargaHoraria = document.getElementById('cargaHorariaDisc').value;
        const frequencia = document.getElementById('frequenciaDisciplina').value;
        const descricao = document.getElementById('descricaoDisciplina').value;
        const cursoId = cursosSelect.value;

        if (!nomeDisciplina || !cargaHoraria || !frequencia || !descricao || !cursoId) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Usuário não autenticado. Por favor, faça login novamente.');
                window.location.href = '../Login/Login.html';
                return;
            }

            const materiaData = {
                nome: nomeDisciplina,
                descricao: descricao,
                ch_total: cargaHoraria.toString(),
                freq_min: frequencia.toString()
            };

            const response = await fetch(`http://localhost:8081/sec/materia/${cursoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(materiaData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar matéria');
            }

            const result = await response.json();
            alert('Matéria cadastrada com sucesso!');
            form.reset();
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar matéria. Por favor, tente novamente.');
        }
    }

    // Adiciona o evento de submit ao formulário
    form.addEventListener('submit', cadastrarMateria);

    // Carrega os cursos ao iniciar a página
    carregarCursos();
});