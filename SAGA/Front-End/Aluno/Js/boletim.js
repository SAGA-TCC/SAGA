document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("boletimTableBody");
    const moduloSelect = document.getElementById("moduloSelect");

    // Adiciona opções dos módulos
    moduloSelect.innerHTML = `
        <option value="1">1º Módulo</option>
        <option value="2">2º Módulo</option>
        <option value="3">3º Módulo</option>
    `;

    // Função para buscar e exibir dados do módulo selecionado
    async function carregarModulo(modulo) {
        tableBody.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8081/aluno/modulo/${modulo}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                tableBody.innerHTML = `<tr><td colspan='4'>Erro ao carregar dados do módulo.</td></tr>`;
                return;
            }
            const data = await response.json();

            tableBody.innerHTML = "";
            if (data.materias && data.materias.length > 0) {
                data.materias.forEach(item => {
                    tableBody.innerHTML += `
                        <tr>
                            <td>${item.nome}</td>
                            <td>${item.notaB1 !== undefined && item.notaB1 !== null && item.notaB1 !== "-" ? item.notaB1 : "Sem nota"}</td>
                            <td>${item.notaB2 !== undefined && item.notaB2 !== null && item.notaB2 !== "-" ? item.notaB2 : "Sem nota"}</td>
                            <td>${item.frequencia ?? "-"}</td>
                        </tr>
                    `;
                });
            } else {
                tableBody.innerHTML = "<tr><td colspan='4'>Nenhuma matéria encontrada para este módulo.</td></tr>";
            }
        } catch (err) {
            tableBody.innerHTML = `<tr><td colspan='4'>Erro ao carregar dados.</td></tr>`;
        }
    }

    // Evento de mudança do select
    moduloSelect.addEventListener("change", function () {
        const modulo = this.value;
        carregarModulo(modulo);
    });

    // Carrega o 1º módulo ao iniciar
    carregarModulo("1");
});
