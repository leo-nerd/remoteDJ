var inputs, outputs;
var socket = io();
var clientNum;
var CClookup;

//get the lookup table from the server
socket.on("cclookup", function(msg) {
  clientNum = msg.clientNum;
  CClookup = msg.lookup;
  console.log("This client (#" + clientNum + ") received lookup table from server");
})

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
      addInputListeners(selectedInput);
    } else {
      console.log("No input available");
    }

    var outputName = $("#output-selector :selected").text();
    var selectedOutput = WebMidi.getOutputByName(outputName);
    if (selectedOutput) {
      routeServerToOutput(selectedOutput);
      
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
      selectedInput.removeListener();
      inputName = $("#input-selector :selected").text();
      selectedInput = WebMidi.getInputByName(inputName);
      addInputListeners(selectedInput);
      console.log("changed input to " + $("#input-selector :selected").text());
    });
    $("#output-selector").on("change", function() {
      socket.off("ctrlfromserver");
      outputName = $("#output-selector :selected").text();
      selectedOutput = WebMidi.getOutputByName(outputName);
      routeServerToOutput(selectedOutput);
      console.log("changed output to " + $("#output-selector :selected").text());
    });

    function addInputListeners(input) {
      input.addListener("controlchange", "all", function(ctrl) {
        socket.emit("ctrlfromclient", {inputName: inputName, payload: ctrl});
        // selectedOutput.sendControlChange(
        //   ctrl.controller.number,
        //   ctrl.value,
        //   ctrl.channel
        // );
      });
    }

    function routeServerToOutput(output) {
      socket.on("ctrlfromserver", function(msg) {
        output.sendControlChange(
          msg.payload.controller.number,
          msg.payload.value,
          msg.payload.channel
        );
      });
    }

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
