var inputs, outputs;
var socket = io();

socket.on("ctrlfromserver", function(msg) {
  console.log(
    "from: " + msg.inputName +   
    "; ch: " + msg.payload.channel + 
    "; CC: " + msg.payload.controller.number +
    "; value:" + msg.payload.value
  );

  // console.log("incoming ctrl: " + msg);
});

var toTraktor;
WebMidi.enable(function(err) {
  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    console.log("WebMidi enabled");
    inputs = WebMidi.inputs;
    outputs = WebMidi.outputs;

    // fill dropdowns with I/O
    refreshLists();

    // add default listener from socket, with adjustable routing
    var inputName = $("#input-selector :selected").text();
    var selectedInput = WebMidi.getInputByName(inputName);
    if (selectedInput) {
      selectedInput.addListener("controlchange", "all", function(ctrl) {
        socket.emit("ctrlfromclient", {input: inputName, payload: ctrl});
        selectedOutput.sendControlChange(
          ctrl.controller.number,
          ctrl.value,
          ctrl.channel
        );
      });
    } else {
      console.log("No input available");
    }

    var outputName = $("#output-selector :selected").text();
    var selectedOutput = WebMidi.getOutputByName(outputName);
    if (selectedOutput) {
      socket.on("ctrlfromserver", function(msg) {
        selectedOutput.sendControlChange(
          msg.payload.controller.number,
          msg.payload.value,
          msg.payload.channel
        );
        // console.log(msg.controller.number + "; " + msg.value);
      });
    } else {
      console.log("No output available");
    }

    // if (toTraktor) {
    // 	console.log('Connected to Traktor');
    // } else {
    // 	console.log("Traktor not detected - make sure Traktor is open");
    // }

    // if (fromMax1) {
    // 	fromMax1.addListener('controlchange', "all" , function(e) {
    // 		console.log("received controlchange", e);
    // 	});
    // } else {
    // 	console.log("Max not detected - make sure Max is open");
    // }

    WebMidi.addListener("connected", function(e) {
      console.log(e.port.name, "connected");
      refreshLists();
    });

    WebMidi.addListener("disconnected", function(e) {
      console.log(e.port.name, "disconnected");
      refreshLists();
    });

    // listen to changes on I/O
    $("#input-selector").on("change", function() {
      console.log("changed input to " + $("#input-selector :selected").text());
      selectedInput = WebMidi.getInputByName(
        $("#input-selector :selected").text()
      );
    });
    $("#output-selector").on("change", function() {
      console.log(
        "changed output to " + $("#output-selector :selected").text()
      );
      selectedOutput = WebMidi.getOutputByName(
        $("#output-selector :selected").text()
      );
    });

    function refreshLists() {
      $("#input-selector")
        .find("option")
        .remove();
      inputs.forEach(function(input) {
        $("#input-selector").append(
          $("<option>")
            .attr("value", input.name)
            .text(input.name)
        );
      });

      $("#output-selector")
        .find("option")
        .remove();
      outputs.forEach(function(output) {
        $("#output-selector").append(
          $("<option>")
            .attr("value", output.name)
            .text(output.name)
        );
      });
    }
  }
});
