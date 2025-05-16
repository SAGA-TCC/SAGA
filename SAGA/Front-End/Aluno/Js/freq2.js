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
  const data = [
    { materia: "Sistemas Web", professor: "Jose" },
    { materia: "Sistemas Web", professor: "Jose" },
    { materia: "Sistemas Web", professor: "Josea" },
    { materia: "Sistemas Web", professor: "Jose" },
    { materia: "Sistemas Web", professor: "Jose" },
    { materia: "Sistemas Web", professor: "Jose" }
  ];

  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.materia}</td>
      <td>${item.professor}</td>
    `;
    tableBody.appendChild(tr);
  });
});
