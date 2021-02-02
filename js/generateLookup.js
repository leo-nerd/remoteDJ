var fs = require('fs');

var array = [];
for (var i = 0; i < 128; i++) {
	array.push(
		{
			'Client1': i,
			'Client2': (i+3) %128, //dummy mapping
			'value': 0
		});
}

console.log("writing file");
var jsonString = JSON.stringify(array);
fs.writeFile("CClookup.json", jsonString, function(err){
	if (err) {
		console.log(err);
	} else {
		console.log("file written");
	}
});