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
                    <td><button onclick="editar('${item.id_user}')">Editar</button></td>
                    <td><button onclick="excluir('${item.id_user}')">Excluir</button></td>
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
function editar(id_user) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "../../Front-End/Login/Login.html";
        return;
    }
    // Redireciona para página de edição com o id_user do usuário
    // Usamos encodeURIComponent para garantir que o id_user seja seguro na URL
    window.location.href = `editarUsuario.html?id_user=${encodeURIComponent(id_user)}`;
    console.log(`Redirecionando para edição do usuário: ${id_user}`);
}


// Função de exclusão
function excluir(id_user) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "../../Front-End/Login/Login.html";
        return;
    }
    
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
    }

    console.log(`Tentando excluir usuário com ID: ${id_user}`);
    
    fetch(`http://localhost:8081/sec/excluirUsuario/${id_user}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error(`Erro na resposta: ${response.status} - ${response.statusText}`);
            
            // Tentar obter mais informações do corpo da resposta
            return response.text().then(text => {
                try {
                    // Tenta converter para JSON se possível
                    const errorData = JSON.parse(text);
                    throw new Error(`Erro ${response.status}: ${errorData.message || text}`);
                } catch (e) {
                    // Se não for JSON válido, usa o texto como está
                    throw new Error(`Erro ${response.status}: ${text || 'Sem detalhes do servidor'}`);
                }
            });
        }
        
        // Verifica se há conteúdo na resposta
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            return null; // Retorna null quando não há JSON na resposta
        }
    })
    .then(data => {
        alert("Usuário excluído com sucesso!");
        // Recarrega a página para atualizar a lista
        window.location.reload();
    })
    .catch(error => {
        console.error("Erro ao excluir usuário:", error);
        alert(`Erro ao excluir usuário: ${error.message}`);
    });
}
