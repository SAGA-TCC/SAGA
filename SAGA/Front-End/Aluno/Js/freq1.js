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

document.addEventListener("DOMContentLoaded", function () {
  const dayCells = document.querySelectorAll(".cal-table td");

  dayCells.forEach(cell => {
    const day = cell.textContent.trim();
    const isDay = !cell.classList.contains("off") && day !== "";

    if (isDay) {
      cell.style.cursor = "pointer";
      cell.addEventListener("click", () => {
        let status = "indefinido";

        if (cell.classList.contains("present")) {
          status = "presente";
        } else if (cell.classList.contains("absent")) {
          status = "ausente";
        } else if (cell.classList.contains("holiday")) {
          status = "nao letivo";
        }

        window.location.href = `dia.html?dia=${day}&status=${status}`;
      });
    }
  });
});
