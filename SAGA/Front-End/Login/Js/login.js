document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita recarregar a página

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value; // 'senha' para corresponder à API

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch("http://localhost:8081/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            alert("Erro: " + (data.error || "Falha ao fazer login."));
            return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.token); // Corrigido
        localStorage.setItem("id_user", data.id_user);

        switch (data.tipo) {
            case 1:
                window.location.href = "../../Front-End/Secretaria/HomeSecretaria.html";
                break;
            case 2:
                window.location.href = "../../Front-End/Professor/HomeProfessor.html";
                break;
            case 3:
                window.location.href = "../../Front-End/Aluno/HomeAluno.html";
                break;
            default:
                alert("Tipo de usuário desconhecido.");
        }
    } catch (error) {
        alert("Erro ao conectar com a API. Verifique sua conexão ou tente novamente mais tarde.");
        console.error("Erro ao conectar com a API:", error);
    }
});
