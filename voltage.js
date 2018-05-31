(function (){
  let chart;
  let optionsObjectArray = [];
  let favoritesList = document.getElementById('favorites-list');

  class FetchOptionsForNewGraph {
    constructor (deviceName, proxyAddr, params) {
      proxyAddr = proxyAddr || `egaug.es`;
      params = params || `m&n=11`;
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

  function getDataIntervals(obj) {
    let intervalArray = [];
    let latestTime = parseInt(obj.group.data.attr.time_stamp, 16);
    let deltaTime = obj.group.data.attr.time_delta;
    let rows = obj.group.data.r.length;
    for (let i=1; i<=rows-1; i++) {
      let date = new Date(((latestTime - (deltaTime * i))*1000));
      intervalArray.push(`${date.getHours()}:${date.getMinutes()}`);
    }
    return intervalArray;
  }

  function getDatasetObjects(obj) {
    let datasetArray = [];
    let datasetObject = {};
    let columns = obj.group.data.attr.columns;
    let rows = obj.group.data.r.length;
    for (let i=0; i<columns; i++) {
      if (obj.group.data.cname[i].t === "V") {
        continue;
      }
      if (datasetObject.labels === undefined) {
        datasetObject.label = `${obj.group.data.cname[i].name} (${obj.group.data.cname[i].attr.t})`;
      }
      if (datasetObject.data === undefined) {
        datasetObject.data = [];
      }
      for (let j=0; j<rows-1; j++){
        let delta = (Math.abs((obj.group.data.r[(j+1)].c[i]) - (obj.group.data.r[j].c[i])));
        datasetObject.data.push(delta);
      }
      datasetObject.backgroundColor = ['rgba(255, 99, 132, 0.2)'];
      datasetArray.push(datasetObject);
      datasetObject = {};
    }
    return datasetArray
  }

  function generateChart(labels, datasets) {
    console.log(datasets[0], datasets[1])
    let ctx = document.getElementById("historical-chart").getContext("2d");
    let chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: datasets
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
    });
    return chart;
  }

  function updateChart(chart, labels, datasets) {
    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
    return chart
  }

  function getVoltageFromEgauge(fetchOptions) {
    fetch(`https://cors-anywhere.herokuapp.com/http://${fetchOptions.deviceName}.${fetchOptions.proxyAddr}/cgi-bin/egauge-show?${fetchOptions.params}`, {
    method: "GET"
    })
    .then((data) => data.text())
    .then((xml) => {
      let result = parser.validate(xml);
      if (result !== true) {
        console.log(result.err);
      }
      let jsonObj = parser.parse(xml, parserOptions);
      let labels = getDataIntervals(jsonObj);
      let datasetArray = getDatasetObjects(jsonObj);
      if (chart === undefined) {
        chart = generateChart(labels, datasetArray);
      }
      else {
        chart = updateChart(chart, labels, datasetArray);
        console.log(chart);
      }
    });
  }

  // options passed to fast-xml-parser: "parser.parse(xml, options)"
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