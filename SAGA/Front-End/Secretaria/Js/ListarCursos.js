document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('ListaCursosTableBody');
    const searchInput = document.querySelector('.search-box input');
    let cursos = [];

<<<<<<< HEAD
    // Função para carregar os cursos
    async function carregarCursos() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Usuário não autenticado. Por favor, faça login novamente.');
                window.location.href = '../Login/Login.html';
                return;
            }
=======
    const data = [
        { codigo: "0", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "1", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "2", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "3", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "4", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" },
        { codigo: "5", nomeCurso: "Técnico em Informática", dt_cadas: "01/01/2025" }
    ];
>>>>>>> ff7d94b0dc14e53645e3c9c1327375af4e3a6b4c

            const response = await fetch('http://localhost:8081/sec/listarCursos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar cursos');
            }

            cursos = await response.json();
            exibirCursos(cursos);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar cursos. Por favor, tente novamente.');
        }
    }

    // Função para excluir curso
    async function excluirCurso(id_curso) {
        if (!confirm('Tem certeza que deseja excluir este curso?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/sec/excluirCurso/${id_curso}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir curso');
            }

            alert('Curso excluído com sucesso!');
            carregarCursos(); // Recarrega a lista
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir curso. Por favor, tente novamente.');
        }
    }

    // Função para exibir os cursos na tabela
    function exibirCursos(cursos) {
        tableBody.innerHTML = '';
        
        cursos.forEach(curso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${curso.codigo}</td>
                <td>${curso.nome}</td>
                <td>${new Date(curso.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                    <a href="editarCurso.html?id=${curso.id_curso}">
                        <button class="editar">Editar</button>
                    </a>
                </td>
                <td>
                    <button class="excluir" onclick="excluirCurso('${curso.id_curso}')">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Função para filtrar cursos
    function filtrarCursos(termo) {
        const termoLower = termo.toLowerCase();
        const cursosFiltrados = cursos.filter(curso => 
            curso.nome.toLowerCase().includes(termoLower) ||
            curso.id_curso.toString().includes(termoLower)
        );
        exibirCursos(cursosFiltrados);
    }

    // Event listener para pesquisa
    searchInput.addEventListener('input', (e) => {
        filtrarCursos(e.target.value);
    });

<<<<<<< HEAD
    // Tornar a função excluirCurso global
    window.excluirCurso = excluirCurso;

    // Carregar cursos ao iniciar
    carregarCursos();
});
=======
// função de pesquisa
function searchFunction() {
    var input = document.getElementById("listInput");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("listTable");
    var trs = table.tBodies[0].getElementsByTagName("tr");

    // Loop through rows
    for (var i = 0; i < trs.length; i++) {
        var tds = trs[i].getElementsByTagName("td");
        trs[i].style.display = "none";

        for (var j = 0; j < 2; j++) { // verifica as primeiras duas colunas 
            if (tds[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                trs[i].style.display = ""; // mostra as colunas se forem encontradas
                break; 
            }
        }
    }
}
>>>>>>> ff7d94b0dc14e53645e3c9c1327375af4e3a6b4c
