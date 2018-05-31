(function (){
  let optionsObjectArray = [];
  let favoritesList = document.getElementById('favorites-list');

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
    document.getElementById('device-name').value = '';
  }

  function updateExistingObjectInArray(index, object) {
    optionsObjectArray[index] === object;
  }

  function updateFavoriteDevicesList(object) {
    let listItem = document.createElement('li');
    let link = document.createElement('a');
    link.innerHTML = object.deviceName;
    link.setAttribute('index', optionsObjectArray.length - 1);
    listItem.appendChild(link);
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


  function getVoltageFromEgauge(fetchOptions) {
    fetch(`https://cors-anywhere.herokuapp.com/http://${fetchOptions.deviceName}.${fetchOptions.proxyAddr}/cgi-bin/egauge-show?m&n=3`, {
    method: "GET"
    })
    .then((data) => data.text())
    .then((xml) => {
      let result = parser.validate(xml);
      if (result !== true) {
        console.log(result.err);
      }
      let jsonObj = parser.parse(xml, parserOptions);
      console.log(jsonObj);
    });
  }

  // options passed to fast-xml-parser "parser.parse(xml, options)"
  const parserOptions = {
    attributeNamePrefix : "",
    attrNodeName: "attr", //declares all attribute names
    textNodeName : "name", //declares all text node names
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : false,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    localeRange: "", //To support non english character in tag/attribute values.
  }

  document.getElementById('favorites-list').addEventListener('click', function(event){
    event.preventDefault();
    let index = event.target.getAttribute('index');
    getVoltageFromEgauge(optionsObjectArray[index]);
  });

})();