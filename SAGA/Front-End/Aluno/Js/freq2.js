document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    headerToolbar: {
      end: 'today prev,next',
      start: 'title'
    },
  });
  calendar.render();

  const tableBody = document.getElementById('freq2TableBody');
  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get('data');

  if (data) {
    fetch(`/aluno/presencas-dia?data=${data}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(presencas => {
      tableBody.innerHTML = '';
      if (presencas.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">Nenhuma aula encontrada para este dia.</td></tr>';
      } else {
        presencas.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${item.materia}</td>
            <td>${item.professor}</td>
            <td>${item.presente ? 'Presente' : 'Falta'}</td>
          `;
          tableBody.appendChild(tr);
        });
      }
    });
  }
});
