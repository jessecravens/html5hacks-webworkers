function StopWatch() {
	this.startTime = new Date();
	this.endTime = null;
	
	this.stop = function() {
		this.endTime = new Date();
	}

	this.reset = function() {
		this.startTime = new Date();
	}
	
	this.duration = function() {
		if( this.endTime == null ) {
			this.stop();
		}
		return this.endTime-this.startTime;
	}
}

function displayDuration(target, stopWatch) {
	document.getElementById("profile" + target ).innerHTML = " <strong>Time Taken:</strong> " +stopWatch.duration()+ "ms ";
}

function displayError(target, e) {
	document.getElementById("error" + target ).innerHTML = " <strong>Failed:</strong> " + e.message + " ";
}

function Backgrounder( initialFunc ) {
	this.timeout = null;
	
	this.schedule = function( func ) {
		var self = this;
		this.timeout = setTimeout( function() { self.execute( func ); }, 0 );
	}
	
	this.execute = function( func ) {
		this.timeout = null;
		func();
	}
	
	this.interrupt = function() {
		clearTimeout( this.timeout );
		this.timeout = null;
	}

	this.finished = function() {
		this.interrupt();
	}
	
	if( initialFunc != undefined ) { 
		initialFunc( this );
	}
}

var backgrounders = Array();
backgrounders[5] = null;
backgrounders[6] = null;

function processSomeData1( target, someData ) {
	stopWatch = new StopWatch();
	initOutput(target);
    for( i = 0; i < someData.length ; ++i ) {
        processAChange( target, someData[i] );
    }
	displayDuration( target, stopWatch );
}

function processSomeData2( target, someData, i, stopWatch ) {
	if( i == undefined ) { 
		stopWatch = new StopWatch();
		initOutput(target);
		i = 0;
	}		
	if( i < someData.length ) {
		processAChange( target, someData[i] );
		try {
			processSomeData2( target, someData, i+1, stopWatch );
		}
		catch( e ) {
			displayError( target, e );
			displayDuration( target, stopWatch );
			clearOutput( target );	
		}
	}
	else {
		displayDuration( target, stopWatch );
	}
}

function processSomeData3( target, someData, i, stopWatch ) {
	if( i == undefined ) { 
		stopWatch = new StopWatch();
		initOutput(target);
		i = 0;
	}		
	if( i < someData.length ) {
		var batchSize = 100;
		for( j = i; j < i+batchSize && j < someData.length; ++j ) {
			processAChange( target, someData[j] );
		}
		processSomeData3( target, someData, i+batchSize, stopWatch );
	}
	else {
		displayDuration( target, stopWatch );
	}
}

function processSomeData4( target, someData, i, stopWatch ) {
	if( i == undefined ) { 
		stopWatch = new StopWatch();
		initOutput(target);
		i = 0;
	}		
	if( i < someData.length ) {
		var batchSize = 100;
		for( j = i; j < i+batchSize && j < someData.length; ++j ) {
			processAChange( target, someData[j] );
		}
		var nextBitOfWork = function() { processSomeData4( target, someData, i+batchSize, stopWatch ) };
		setTimeout( nextBitOfWork, 0 );
	}
	else {
		displayDuration( target, stopWatch );
	}
}

function processSomeData5( backgrounder, target, someData, i, stopWatch ) {
	if( i == undefined ) { 
		stopWatch = new StopWatch();
		initOutput(target, backgrounder);
		i = 0;
	}		
	if( i < someData.length ) {
		var batchSize = 100;
		for( j = i; j < i+batchSize && j < someData.length; ++j ) {
			processAChange( target, someData[j] );
		}
		var nextBitOfWork = function() { processSomeData5( backgrounder, target, someData, i+batchSize, stopWatch ) };
		backgrounder.schedule( nextBitOfWork );
	}
	else {
		backgrounders[5] = null;
		displayDuration( target, stopWatch );
	}
}

function ProcessSomeData6( target, someData ) {
	this.inherits_from = Backgrounder;
	this.inherits_from();

	this.stopWatch = new StopWatch();
	this.target = target;
	this.someData = someData;
	this.batchSize = 100;
	
	this.process = function( i ) {
		if( i < this.someData.length ) {
			for( j = i; j < i+this.batchSize && j < this.someData.length; ++j ) {
				processAChange( this.target, this.someData[j] );
			}
			var self = this;
			var nextBitOfWork = function() { self.process( i+self.batchSize ) };
			this.schedule( nextBitOfWork );
		}
		else {
			backgrounders[6] = null;
			displayDuration( this.target, this.stopWatch );
		}
	}

	initOutput(target, this);	
	this.process( 0 );
}

function processAChange( target, change ) {
	document.getElementById("output" + target).innerHTML+=change + " ";
}

function initOutput(target, backgrounder) {
	clearOutput(target);
	document.getElementById("profile" + target ).innerHTML="<strong>Running...</strong>";
	
	if( backgrounder != undefined ) {
		document.getElementById("profile" + target).innerHTML+=' <span><button onclick="stopOutput('+target
		+');">Stop</button></span>';
	}

	document.getElementById("clear" + target).innerHTML='<button onclick="stopOutput('+target
	+'); clearOutput('+target
	+');">Clear</button>';
}

function clearOutput( target ) {
	document.getElementById("output" + target).innerHTML="";
	document.getElementById("clear" + target).innerHTML="";
}

function stopOutput( target ) {
	if( backgrounders[target] != null ) { 
		backgrounders[target].interrupt();
		document.getElementById("profile" + target).innerHTML="<strong>interrupted</strong>";
	}
}

function clearProfile( target ) {
	document.getElementById("profile" + target ).innerHTML="";
}

function runTest1() {
	var someData = new Array();
	for( i = 0; i < 2000; ++i ) {
		someData[i] = i + " ";
	}
	processSomeData1( 1, someData );
}

function runTest2() {
	for( i = 0; i < 100; ++i ) {
	var someData = new Array();
		someData[i] = i + " ";
	}
	processSomeData2( 2, someData );
}

function runTest3() {
	var someData = new Array();
	for( i = 0; i < 2000; ++i ) {
		someData[i] = i + " ";
	}
	processSomeData3( 3, someData );
}

function runTest4() {
	var someData = new Array();
	for( i = 0; i < 2000; ++i ) {
		someData[i] = i + " ";
	}
	processSomeData4( 4, someData );
}

function runTest5() {
	var someData = new Array();
	for( i = 0; i < 2000; ++i ) {
		someData[i] = i + " ";
	}
	if( backgrounders[5] != null ) { 
		backgrounders[5].interrupt();
	}
	backgrounders[5] = new Backgrounder( function( backgrounder ) { processSomeData5( backgrounder, 5, someData ); } );
}

function runTest6() {
	var someData = new Array();
	for( i = 0; i < 2000; ++i ) {
		someData[i] = i + " ";
	}
	if( backgrounders[6] != null ) { 
		backgrounders[6].interrupt();
	}
	backgrounders[6] = new ProcessSomeData6( 6, someData );
}
