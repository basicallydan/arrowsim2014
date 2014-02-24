var L = require('leaflet');
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
var path = require('path');

var map = L.map('map', {
	center: [51.5,0.13],
	zoom: 5,
	minZoom: 2,
	maxZoom: 10,
	maxBounds: [[-90,-180],[90,180]]
});

var canvasTiles = L.tileLayer.canvas();
Math.toRadians = function (degrees) {
	return (degrees * (Math.PI / 180));
};

var territories = require('./territories');

var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';
 
var tiles = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png';
 

L.tileLayer(tiles, {
	attribution: attribution
}).addTo(map);

territories.load(map);

map.on('click', addArrowSegment);

L.LatLng.prototype.setPrecision = function(decimalPlaces) {
	this.lat = +this.lat.toFixed(decimalPlaces);
	this.lng = +this.lng.toFixed(decimalPlaces);
};

L.LatLng.prototype.rotateLatitudeAround = function(angle, center) {
    this.lat = center.lat + (Math.cos(Math.toRadians(angle)) * (this.lat - center.lat) - Math.sin(Math.toRadians(angle)) * (this.lng - center.lng));
};

L.LatLng.prototype.rotateLongitudeAround = function(angle, center) {
    this.lng = center.lng + (Math.sin(Math.toRadians(angle)) * (this.lat - center.lat) + Math.cos(Math.toRadians(angle)) * (this.lng - center.lng));
};

L.Path.prototype.rotate = function (angle, center) {
	var oldPoints = arrowPolyline.getLatLngs();
	if (!center) {
		center = L.latLng(oldPoints[0].lat, oldPoints[0].lng);
	} else if (typeof center === 'array') {
		center = L.latLng(oldPoints[0][0], oldPoints[0][1]);
	}
	var newPoints = [];

	oldPoints.forEach(function (p) {
		var newPoint = L.latLng(p.lat, p.lng);
		newPoint.rotateLongitudeAround(10, oldPoints[0]);
		newPoint.rotateLatitudeAround(10, oldPoints[0]);
		newPoints.push(newPoint);
	});

	this.setLatLngs(newPoints);
};

var arrowPolyline = L.polyline([], {color: 'purple'}).addTo(map);
arrowPolyline.dragging = false;
function addArrowSegment(mouseEvent) {
	// console.log('LatLng Clicked:', mouseEvent.latlng);
	var newPoint = mouseEvent.latlng;
	newPoint.setPrecision(4);
	arrowPolyline.addLatLng(newPoint);
	arrowPolyline.redraw();
}

arrowPolyline.on('mousedown', function (mouseEvent) {
	arrowPolyline.dragging = true;
	console.log('Mouse down on polyline');
});

map.on('mouseup', function (mouseEvent) {
	arrowPolyline.dragging = false;
});

map.on('mousemove', function (mouseEvent) {
	if (arrowPolyline.dragging) {
		console.log('Mouse move on map', mouseEvent);
		arrowPolyline.rotate(1);
		return false;
	}
});

function drawCircle(mouseEvent) {
	L.circle(mouseEvent.latlng, 100000, {color: '#FF5454'}).addTo(map);
}