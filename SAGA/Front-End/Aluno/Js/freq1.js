document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("freqChart").getContext("2d");

  new Chart(ctx, {
    type: "pie", 
    data: {
      labels: ["Presença", "Ausência"],
      datasets: [
        {
          data: [50, 50],
          backgroundColor: ["#00B000", "#D00000"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
        datalabels: {
          color: "white",
          font: {
            weight: "bold",
            size: 18,
          },
          formatter: (value, context) => value + "%",
        },
      },
    },
    plugins: [ChartDataLabels],
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    headerToolbar: {
      end: 'today prev,next',
      start: 'title'
    },
  });

  calendar.render();
});