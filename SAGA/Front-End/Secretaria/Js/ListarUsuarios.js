document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "../../Front-End/Login/Login.html";
        return;
    }

    const tableBody = document.getElementById("ListaUsuariosTableBody");

    fetch("http://localhost:8081/sec/listarUsuarios", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na requisição: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.matricula}</td>
                    <td>${item.nome}</td>
                    <td>${item.email}</td>
                    <td>${new Date(item.dt_nasc).toLocaleDateString()}</td>
                    <td><button onclick="editar('${item.id}')">Editar</button></td>
                    <td><button onclick="excluir('${item.id}')">Excluir</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar os usuários:", error);
            tableBody.innerHTML = "<tr><td colspan='6'>Erro ao carregar os dados.</td></tr>";
        });
});

// Função de edição
function editar(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "../../Front-End/Login/Login.html";
        return;
    }
    // Redireciona para página de edição com o ID do usuário
    // Usamos encodeURIComponent para garantir que o ID seja seguro na URL
    window.location.href = `editarUsuario.html?id=${encodeURIComponent(id)}`;
}


// Função de exclusão
function excluir(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "../../Front-End/Login/Login.html";
        return;
    }
    
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
    }

    fetch(`http://localhost:8081/sec/excluirUsuario/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        alert("Usuário excluído com sucesso!");
        // Recarrega a página para atualizar a lista
        window.location.reload();
    })
    .catch(error => {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário. Verifique o ID ou se o servidor está acessível.");
    });
}
