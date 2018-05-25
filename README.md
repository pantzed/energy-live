# energy-graph
A webpage that displays graphical electrical energy data.

## Project Specs:

### What problem does your project solve?
The project allows egauge energy meter users to better visualize their data. 

### How will your project solve this problem?
It will provide a less granular visual representation of data, so that it can be more easily understood.

### What inputs does your project need?
Data from an eGauge meter.

### What outputs does your project produce, and how do they help solve the problem? This includes:
A bar graph (column chart) with one column for each measurement point. The graph will be built using an html canvas. 
Numerical power values for each measurement point.
The data is delivered as a delta, so the program will need to calculate the difference between the previous and current call. This might involve storing data in an object and updating that object with each call. 

### External Data
API: https://www.egauge.net/docs/egauge-xml-api.pdf
Validated that information can be called:
```
$ http -v GET "egauge8642.egaug.es/cgi-bin/egauge?inst"
GET /cgi-bin/egauge?inst HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: egauge8642.egaug.es
User-Agent: HTTPie/0.9.9

HTTP/1.1 200 OK
Cache-Control: no-cache
Content-type: text/xml
Date: Fri, 25 May 2018 15:47:41 GMT
Server: lighttpd/1.4.31
Transfer-Encoding: chunked

<?xml version="1.0" encoding="UTF-8" ?>
<data serial="0x8a7a9c0">
 <ts>1527263261</ts>
 <r t="P" n="Grid"><v>-159600880850</v><i>-606</i></r>
</data>
```

### Technical Stack
* CSS Framework
	Skeleton
* Javascript Libraries
	Standard
* External Libraries
Maybe d3.js
* Deployment Method
	Surge
    
### Feature List
Input a specific energy meter
Options for a static or dynamic graph
Mobile friendly

