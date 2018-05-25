(function() {

  let canvas = document.getElementById('canvas-1');
  let ctx = canvas.getContext('2d');
  
  ctx.fillStyle = "green";
  ctx.fillRect(10, 200, 40, 100);
  
  ctx.fillStyle = "blue";
  ctx.fillRect(60, 150, 40, 150);
  
  })();