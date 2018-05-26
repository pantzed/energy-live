import Chart from "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js";

(function() {

  let ctx = document.getElementById('canvas-1').getContext('2d');

  let powerBars = new CharacterData(ctx, {
    type: 'bar',
    data: {
      labels: ["Grid"],
      datasets: [{
        label: "Power",
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [50]
      }]
    },
    options: {}
  });
  
  })();