var L = require('leaflet');
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
var path = require('path');
var map = L.map('map').setView([40, -74.50], 9);
var xhr = require('xhr-browserify');
var canvasTiles = L.tileLayer.canvas();

var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';
 
var tiles = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png';
 
L.tileLayer(tiles, {
  maxZoom: 18,
  attribution: attribution
}).addTo(map);

/*canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
	var ctx = canvas.getContext('2d');
    ctx.fillRect(25,25,100,100);
};

map.addLayer(canvasTiles);*/


// Get a file
xhr('/world-countries.json', { json : true }, function (data) {
	var states = L.geoJson(data, {
		onEachFeature: function(feature, layer){
			layer.on({
				click: addArrowSegment,	
				contextmenu: drawCircle
			})
		}
	}).addTo(map);
	// var latLngs = data.match(/-?[0-9]+\.[0-9]+?, ?-?[0-9]+\.[0-9]+/g);
	// latLngs.forEach(function (ll) {
	// console.log(ll);
	// });
});



map.on('contextmenu', drawCircle);

map.on('click', addArrowSegment);


var arrowPolyline = L.polyline([], {color: 'purple'}).addTo(map);
function addArrowSegment(mouseEvent) {
	arrowPolyline.addLatLng(mouseEvent.latlng);
	arrowPolyline.redraw();	
}


function drawCircle(mouseEvent) {	
	L.circle(mouseEvent.latlng, 100000, {color: '#FF5454'}).addTo(map);
}