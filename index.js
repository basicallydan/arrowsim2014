require('mapbox.js');
var path = require('path');
var map = L.mapbox.map('map', 'arrowsim.hadb7j5h').setView([40, -74.50], 9);
var xhr = require('xhr-browserify');

// Get a file
xhr('/world-countries.json', { json : true }, function (data) {
	var states = L.geoJson(data).addTo(map);
	// var latLngs = data.match(/-?[0-9]+\.[0-9]+?, ?-?[0-9]+\.[0-9]+/g);
	// latLngs.forEach(function (ll) {
	// 	console.log(ll);
	// });
});