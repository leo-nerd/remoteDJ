const fs = require('fs');
var rawData = fs.readFileSync('CClookup.json');
var array = JSON.parse(rawData);
// console.log(array);

//sort according to Client2 key:
array.sort(function(a, b) {
	return ((a.Client2 < b.Client2) ? -1 : 1);
});

console.log(array);