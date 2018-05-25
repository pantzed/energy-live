(function(){
  fetch("http://egauge8642.egaug.es/cgi-bin/egauge?tot")
  .then((response) => response.text())
  // .then((response) => response.text())
  .then((data) => {
    console.log(data)
  });
})();