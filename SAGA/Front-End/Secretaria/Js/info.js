// Função para formatar a data no padrão dd/mm/yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return ''; // caso a data seja inválida, retorna vazio
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const id_user = localStorage.getItem('id_user'); 
  const apiUrl = `http://localhost:8081/info/${id_user}`;

  const token = localStorage.getItem('token');
  if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      window.location.href = "../../Front-End/Login/Login.html";
      return;
  }

  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(window.location.href = "../../Front-End/Login/Login.html", alert("Token Expirado"), localStorage.removeItem('token'), localStorage.removeItem('id_user'));
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        document.getElementById('nome').value = data.nome || '';
        document.getElementById('nascimento').value = data.dt_nasc ? formatDate(data.dt_nasc) : '';
        document.getElementById('matricula').value = data.matricula || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('telefone').value = data.telefone || '';
        document.getElementById('cpf').value = data.cpf || '';
      } else {
        console.error('Usuário não encontrado');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar dados da API:', error);
    });
});
