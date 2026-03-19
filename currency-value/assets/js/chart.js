const API_KEY = "hkV0v6YVFkee0tX8O6QcpFaBDOmabyuq";

let myChart = null;

document.getElementById("currencyForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const errorDiv = document.getElementById("error");

  if (!from || !to || !start || !end) {
    errorDiv.innerText = "All fields are required.";
    return;
  }

  if (from === to) {
    errorDiv.innerText = "Currencies must be different.";
    return;
  }

  if (start > end) {
    errorDiv.innerText = "Start date must be before end date.";
    return;
  }

  const url = `https://api.polygon.io/v2/aggs/ticker/C:${from}${to}/range/1/day/${start}/${end}?apiKey=${API_KEY}`;

  console.log("URL:", url);

 fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("API RESPONSE:", data); 

    if (!data.results || data.results.length === 0) {
      document.getElementById("error").innerText = "No data found.";
      return;
    }

    const dates = data.results.map(r =>
      new Date(r.t).toLocaleDateString()
    );

    const values = data.results.map(r => r.c);

    drawChart(dates, values);
  })

function drawChart(dates, values) {
  if (myChart) {
    myChart.destroy();
  }

  var ctx = document.getElementById("chartjs-0").getContext("2d");

  myChart = new Chart(ctx, {
    "type": "line",
    "data": {
      "labels": dates,
      "datasets": [{
        "data": values,
        "fill": false
      }]
    },
    "options": {
      responsive: false,
      maintainAspectRatio: true
    }
  });
}

  document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("currencyForm").reset();
  document.getElementById("error").innerText = "";
  
  if (myChart) {
    myChart.destroy();
    myChart = null;
  }
});})