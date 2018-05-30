(function (){

  class FetchOptionsForNewGraph {
    constructor (deviceName, proxyAddr, granu) {

    }
    deviceName:
  }

  function getVoltageFromEgauge(fetchOptions) {
    fetch(`https://cors-anywhere.herokuapp.com/http://${deviceName}.${proxy}/cgi-bin/egauge-show?`, {
    method: "GET"
    })
    .then((data) => data.text())
    .then((xml) => {
      console.log(xml);
    });
  }

})();