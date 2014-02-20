require('mapbox.js');
var path = require('path');
var map = L.mapbox.map('map', 'arrowsim.hadb7j5h').setView([40, -74.50], 9);
var xhr = require('xhr-browserify');
var canvasTiles = L.tileLayer.canvas();

canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
	var ctx = canvas.getContext('2d');
    ctx.fillRect(25,25,100,100);
};

map.addLayer(canvasTiles);

// Get a file
xhr('/world-countries.json', { json : true }, function (data) {
	var states = L.geoJson(data).addTo(map);
	// var latLngs = data.match(/-?[0-9]+\.[0-9]+?, ?-?[0-9]+\.[0-9]+/g);
	// latLngs.forEach(function (ll) {
	// 	console.log(ll);
	// });
});