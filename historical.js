(function (){
  let fetchOptions = {

  }

  function getVoltageFromEgauge(fetchOptions) {
    fetch(`https://cors-anywhere.herokuapp.com/http://${deviceName}.${proxy}/cgi-bin/egauge?inst`, {
    method: "GET"
    })
    .then((data) => data.text())
    .then((xml) => {
      console.log(xml);
    });
  }

})();