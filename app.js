(function(){
  let abort;
  let proxy = 'egaug.es';
  let deviceName;
  let xmlDOM;
  let jsonObject;
  let registers;
  let timeStamp;
  let serial;

  function makeRegistersObject(registers) {
    let obj = {};
    registers.forEach(function(innerObj) {
      obj[innerObj['@attributes'].n] = {'type': `${convertRegisterType(innerObj)}`, 'power': Math.abs(parseFloat([innerObj.v])), 'delta': Math.abs(parseFloat([innerObj.i]))};
    });
    return obj;
  }

  function convertRegisterType(obj) {
    let type = obj['@attributes'].t;
    if (type === 'P' || type === 'S') {
      return 'kW';
    }
    else if (type === 'V') {
      return 'Volts';
    }
    else {
      return type;
    }
  }

  function makeTableWithData(data){
    let regList = document.getElementById('register-table-rows');
    regList.innerHTML = "";
    for (let key in data) {
      let childRow = document.createElement('tr');
      let childDataName = document.createElement('td');
      let childDataValue = document.createElement('td');
      let childDataType = document.createElement('td');
      childDataName.innerText = `${key}`;
      childDataValue.innerText = `${data[key].delta}`;
      childDataType.innerText = `${data[key].type}`;
      childRow.appendChild(childDataName);
      childRow.appendChild(childDataValue);
      childRow.appendChild(childDataType);
      regList.appendChild(childRow);
    }
  }

  // Changes XML to JSON
  // Modified version from here: http://davidwalsh.name/convert-xml-json
  function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }
    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
      obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }

    //Functions to build, populate, and update graph
    let chartObjArray = [];
    let graphLabels = [];
    let dataSet = [];
    let chart;
  
    function makeChartObject() {
      let ctx = document.getElementById('canvas-1').getContext('2d');
      chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: graphLabels,
          datasets: [{
            label: "Power",
            data: dataSet,
            backgroundColor: [
              'rgb(255, 99, 132)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          animation: false
        }
      });
      return chart;
    }

    function updateChartData() {
      let chartObj = chartObjArray[0];
      chartObj.data.datasets.data = dataSet;
      chartObj.data.labels = graphLabels;
      chartObj.update()
    }

    function gatherChartLabels(registers) {
      for (let key in registers) {
        graphLabels.push(key);
      }
    }

    function gatherChartData(registers) {
      for (let key in registers) {
        dataSet.push(registers[key].delta);
      }
    }

    function clearChartArray() {
      chartObjArray = [];
    }

    function clearChartDataAndLabels(){
      graphLabels = [];
      dataSet = [];
    }
    //End graph stuff

  function callEgauge() {
    fetch(`https://cors-anywhere.herokuapp.com/http://${deviceName}.${proxy}/cgi-bin/egauge?inst`, {
      method: "GET"
    })
    .then(data => data.text())
    .then(xml => {
      document.getElementById('device-form').addEventListener('submit', function(){
        abort = true;
      });
      xmlDOM = new DOMParser().parseFromString(xml, 'text/xml');
      jsonObject = xmlToJson(xmlDOM);
      timeStamp = jsonObject.data.ts;
      serial = jsonObject.data['@attributes'].serial;
      registers = makeRegistersObject(jsonObject.data.r);
      makeTableWithData(registers);
      if (chartObjArray.length < 1) {
        gatherChartData(registers);
        gatherChartLabels(registers);
        let newChart = makeChartObject();
        chartObjArray.push(newChart);
      }
      else {
        chartObjArray[0].destroy();
        clearChartArray();
        clearChartDataAndLabels();
        gatherChartData(registers);
        gatherChartLabels(registers);
        let newChart = makeChartObject();
        chartObjArray.push(newChart);
        console.log(chartObjArray);
      }
    })
    .then(() => {
      if (abort === true){
        abort = false;
        chartObjArray[0].destroy();
        clearChartArray();
        clearChartDataAndLabels();
        return;
      }
      else {
        callEgauge();
        addBlinker();
      }
    })
  }

  function clearAllOnNewSubmit() {
    event.preventDefault();
    xmlDOM = '';
    jsonObject = '';
    timeStamp = '';
    serial = '';
    registers = '';
    deviceName = document.getElementById('device-name').value;
    console.log(deviceName);
  }

  function clearForm() {
    document.getElementById('device-name').value = '';
  }

  document.getElementById('device-form').addEventListener('submit', function(){
    clearAllOnNewSubmit();
    clearForm();
    removeBlinker();
    callEgauge();
  });

  function addBlinker() {
    document.getElementById('blinker').classList.add('blinker');
  }

  function removeBlinker() {
    document.getElementById('blinker').classList.remove('blinker');
  }


})();