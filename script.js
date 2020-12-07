navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    // console.log(midiAccess);
    const inputs = midiAccess.inputs.values();
    const outputs = midiAccess.outputs.values();

    for (var input of midiAccess.inputs.values()) {
    	input.onmidimessage = (msg) => getMIDIMessage(msg);
    	// input.onmidimessage = (msg) => {console.log(msg);};
    }

    midiAccess.onstatechange = function(e) {
    	console.log(e.port.name, e.port.state);
    }
}

function getMIDIMessage(midiMessage) {
	// console.log("hey");
	console.log(midiMessage.data);
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}