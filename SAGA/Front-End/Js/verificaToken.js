// Função para verificar o token
function verificaToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "../../Front-End/Login/Login.html";
        return;
    }

    fetch("http://localhost:8081/token", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Token inválido ou expirado');
        }
        // Se chegou aqui, o token é válido, não precisamos fazer nada
    })
    
}

// Executa a verificação assim que a página carregar
document.addEventListener('DOMContentLoaded', verificaToken);