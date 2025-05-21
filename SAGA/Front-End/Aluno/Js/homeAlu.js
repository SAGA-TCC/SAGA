document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menuSuspenso');
    const perfil = document.querySelector('.perfil');
  
    function toggleMenu() {
      if (menu) {
        menu.classList.toggle('ativo');
      }
    }
  
    // Adiciona o evento de clique no perfil
    if (perfil) {
      perfil.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }
  
    // Fecha o menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (menu && perfil && !perfil.contains(e.target)) {
        menu.classList.remove('ativo');
      }
    });
  
    // Adiciona funcionalidade ao botão de sair
    const btnSair = document.querySelector('.sair');
    if (btnSair) {
      btnSair.addEventListener('click', () => {
        // Aqui você pode adicionar a lógica de logout
        window.location.href = '../../Login/Login.html';
      });
    }
  });