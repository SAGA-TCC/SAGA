document.addEventListener('DOMContentLoaded', () => {
    const btnCadastrar = document.querySelector('button');
  
    btnCadastrar.addEventListener('click', async () => {
      const nome = document.getElementById('nome').value.trim();
      const dt_nasc = document.getElementById('nascimento').value.trim(); // formato dd/mm/yyyy
      const email = document.getElementById('email').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const cpf = document.getElementById('cpf').value.trim();
      const senha = document.getElementById('senha').value.trim();
      const tipo = parseInt(document.getElementById('selectPerson').value);
  
      if (!nome || !dt_nasc || !email || !telefone || !cpf || !senha) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }
  
      // Converter a data para o formato ISO (yyyy-mm-ddT00:00:00.000Z)
      const [dia, mes, ano] = dt_nasc.split('/');
      const nascimentoISO = `${ano}-${mes}-${dia}T00:00:00.000Z`;
  
      const novoUsuario = {
        nome,
        email,
        senha,
        dt_nasc: nascimentoISO,
        telefone,
        cpf,
        ft_perfil: "sem foto",
        tipo
      };
  
      try {
        const token = localStorage.getItem('token');
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "../../Front-End/Login/Login.html";
        return;
    }
  
        // Requisição de cadastro
        const response = await fetch('http://localhost:8081/sec/cad', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(novoUsuario)
        });
  
        if (!response.ok) {
          throw new Error("Erro ao cadastrar usuário.");
        }
  
        alert("Usuário cadastrado com sucesso!");
      } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao tentar cadastrar.");
      }
    });
  });
  