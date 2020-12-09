var inputs, outputs;
var fromTraktor, toTraktor;
WebMidi.enable(function(err) {
	if (err) {
		console.log("WebMidi could not be enabled.", err);
	} else {
		console.log("WebMidi enabled");
		inputs = WebMidi.inputs;
		outputs = WebMidi.outputs;
		fromTraktor = WebMidi.getInputByName("Traktor Virtual Output");
		fromMax1 = WebMidi.getInputByName("from Max 1");
		toTraktor = WebMidi.getOutputByName("Traktor Virtual Input");
	}

	if (fromTraktor) {
		fromTraktor.addListener('controlchange', "all" , function(e) {
			console.log("received controlchange", e);
		});
	} else {
		console.log("Traktor not detected - make sure Traktor is open");
	}

	if (fromMax1) {
		fromMax1.addListener('controlchange', "all" , function(e) {
			console.log("received controlchange", e);
		});
	} else {
		console.log("Max not detected - make sure Max is open");
	}

	WebMidi.addListener("connected", function(e) {
		console.log(e.port.name, "connected");
	});

	WebMidi.addListener("disconnected", function(e) {
		console.log(e.port.name, "disconnected");
	});
});