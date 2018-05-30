(function (){

  let optionsObjectArray = [];
  let favoritesList = document.getElementById('device-list-voltage');

  class FetchOptionsForNewGraph {
    constructor (deviceName, proxyAddr, params) {
      proxyAddr = proxyAddr || `egaug.es`;
      params = params || {};
      this.deviceName = deviceName;
      this.proxyAddr = proxyAddr;
      this.params = params;
    }
  }

  document.getElementById('device-form').addEventListener('submit', newFetchOptionsObject);

  function newFetchOptionsObject(event) {
    event.preventDefault();
    let deviceName = document.getElementById('device-name').value;
    let newOptionsObject = new FetchOptionsForNewGraph(deviceName);
    let exists = findExistingDeviceName(newOptionsObject);
    if (exists === false) {
      optionsObjectArray.push(newOptionsObject);
      updateFavoriteDevicesList(newOptionsObject);
    }
    else {
      updateExistingObjectInArray(exists, newFetchOptionsObject);
    }
  }

  function updateExistingObjectInArray(index, object) {
    optionsObjectArray[index] === object;
  }

  function updateFavoriteDevicesList(object) {
    let listItem = document.createElement('li');
    listItem.innerHTML = object.deviceName;
    favoritesList.appendChild(listItem);
  }

  function findExistingDeviceName(object) {
    for (let i=0; i<optionsObjectArray.length; i++) {
      if (optionsObjectArray[i].deviceName === object.deviceName) {
        return i;
      }
    }
    return false;
  }

  // function getVoltageFromEgauge(fetchOptions) {
  //   fetch(`https://cors-anywhere.herokuapp.com/http://${deviceName}.${proxy}/cgi-bin/egauge-show?`, {
  //   method: "GET"
  //   })
  //   .then((data) => data.text())
  //   .then((xml) => {
  //     console.log(xml);
  //   });
  // }

})();