document.addEventListener("DOMContentLoaded", async function () {
    // Extrai o ID da URL
    const params = new URLSearchParams(window.location.search);
    const id_usuario = params.get("id");
    console.log("URL atual:", window.location.href); // Log da URL completa
    console.log("ID do usuário extraído da URL:", id_usuario);

    if (!id_usuario) {
        alert("ID do usuário não encontrado na URL.");
        return;
    }

    // Recupera o token do localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "../../Front-End/Login/Login.html";
        return;
    }

    try {
        // Faz a requisição para a API
        const response = await fetch(`http://localhost:8081/sec/consultarUsuario/${id_usuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const usuario = await response.json();

        // Preenche os campos do formulário com os dados recebidos
        document.getElementById("nome").value = usuario.nome || "";
        document.getElementById("email").value = usuario.email || "";
        document.getElementById("telefone").value = usuario.telefone || "";
        document.getElementById("cpf").value = usuario.cpf || "";

        // Formata a data de nascimento para o input datetime-local
        if (usuario.dt_nasc) {
            const dt = new Date(usuario.dt_nasc);
            document.getElementById("nascimento").value = dt.toISOString().slice(0, 16);
        }
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        alert("Erro ao carregar os dados do usuário. Verifique o console para mais detalhes.");
    }

    // Captura o evento de envio do formulário
    document.getElementById("form-editar-usuario").addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Formulário enviado");

        const id_usuario = new URLSearchParams(window.location.search).get("id");
        if (!id_usuario) {
            alert("ID do usuário não encontrado na URL.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token não encontrado. Faça login novamente.");
            window.location.href = "../../Front-End/Login/Login.html";
            return;
        }

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const cpf = document.getElementById("cpf").value;
        const dt_nasc = new Date(document.getElementById("nascimento").value).toISOString();
        const senha = document.getElementById("senha").value;

        try {
            const response = await fetch(`http://localhost:8081/sec/editarUsuario/${id_usuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ 
                    nome, 
                    email, 
                    telefone, 
                    cpf, 
                    dt_nasc, 
                    senha 
                })
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            alert("Dados atualizados com sucesso!");
            window.location.href = "ListarUsuarios.html"; // Redireciona após sucesso
        } catch (error) {
            console.error("Erro ao editar os dados do usuário:", error);
            alert("Erro ao salvar os dados do usuário. Verifique o console para mais detalhes.");
        }
    });
});

async function editarUsuario(req, res) {
    const { id_user } = req.params;
    const { nome, email, senha, dt_nasc, telefone, ft_perfil } = req.body;

    try {
        // Verifica se o usuário existe
        const usuarioExistente = await prisma.user.findUnique({
            where: { id: id_user }
        });

        if (!usuarioExistente) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Verifica se a senha foi fornecida
        let senhaHash;
        if (senha) {
            senhaHash = await bcrypt.hash(senha, 10);
        }

        const usuario = await prisma.user.update({
            where: { id: id_user },
            data: {
                nome,
                email,
                senha: senhaHash || undefined, // Atualiza a senha apenas se fornecida
                dt_nasc,
                telefone,
                ft_perfil
            }
        });

        return res.json(usuario);
    } catch (error) {
        console.error("Erro ao editar usuário:", error); // Log detalhado para depuração
        return res.status(500).json({
            erro: "Erro ao editar usuário",
            detalhes: error.message
        });
    }
}