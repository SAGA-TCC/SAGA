document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cursoForm');
    const cadastrarButton = form.querySelector('button[type="button"]');

    cadastrarButton.addEventListener('click', async () => {
        // Coleta os dados do formulário
        const nomeCurso = document.getElementById('nomeCurso').value;
        const cargaHoraria = document.getElementById('cargaHoraria').value;
        const serie = document.getElementById('serie').value;
        const frequencia = document.getElementById('frequencia').value;
        const descricao = document.getElementById('descricao').value;

        // Valida se todos os campos foram preenchidos
        if (!nomeCurso || !cargaHoraria || !serie || !frequencia || !descricao) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // Obtém o token do localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Usuário não autenticado. Por favor, faça login novamente.');
                window.location.href = '../Login/Login.html';
                return;
            }            // Prepara os dados para enviar
            const cursoData = {
                nome: nomeCurso,
                periodo: serie,
                descricao: descricao,
                ch_total: cargaHoraria.toString(),
                freq_min: frequencia.toString()
            };

            // Faz a requisição para a API
            const response = await fetch('http://localhost:8081/sec/curso', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cursoData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar curso');
            }

            const result = await response.json();
            alert('Curso cadastrado com sucesso!');


        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar curso. Por favor, tente novamente.');
        }
    });
});