
// self.onmessage = function(json) {    


// var r = json.recordsReturned;
// var c = Math.round(json.avgPrice);
// console.log(Math.round(c))
// var r = 10;
// var c = 10;
// 
// var a = new Array(r);
// 
// for (var i = 0; i < r; i++) {
//     a[i] = new Array(c);
// 
//     for (var j = 0; j < c; j++) {
//         a[i][j] = "[" + i + "," + j + "]";
//     }
// }

// self.postMessage(json);
// };

// This script is executed in the worker

var filters = {
  filterHugeDataSet: function (data, filter) {
    // do some kind of filtering...
    // this is crummy, but you get the idea
    var obj = {};
    
    for ( var key in data ) {
      if ( key == filter ) {
        obj[key] = data[key];
      }
    }
    
    return obj;
  }
};

var computations = {
	
  create2Darray: function (data) {
	// var r = data.recordsReturned;
	// var c = Math.round(data.avgPrice);
	var r = 700;
	var c = 700;
	
	var a = new Array(r);
	
	for (var i = 0; i < r; i++) {
	    a[i] = new Array(c);
	
	    for (var j = 0; j < c; j++) {
	        a[i][j] = "[" + i + "," + j + "]";
	    }
	}
    
    return a;
  }
};


/*
The worker will begin running when it receives
a message from the main window.
The first thing it will have to do is parse the
message back into object.
*/

self.addEventListener('message', function (event) {
    
  var message = JSON.parse(event.data),
      filtered = {};
	  computated = {};
	  // testObj = {"highComp": 33}
  
  /*
`message` is now an object again. and looks how
you expect it to:

message = {
fn: 'filterHugeDataSet',
data: { foo:'bar' },
filter: 'foo'
};
Use your imagination here...If we had an object
called "filters" with a function property called
"filterHugeDataSet" we could now call it with
the params we passed along with the data
*/
  
// filtered['data'] = filters[message.fn](message.data, message.filter); 
	// filtered['data'] = message.data;
	computated['highComp'] = computations[message.compfn](message.data);
	
/*
Now we want to send it back. Once again we'll
manually serialize the object
*/
  
  // this.postMessage(filtered);
  // this.postMessage(message.data);
	 this.postMessage(computated);

}, false);