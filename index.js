var L = require('leaflet');
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
var path = require('path');
var map = L.map('map').setView([40, -74.50], 9);
var xhr = require('xhr-browserify');
var canvasTiles = L.tileLayer.canvas();
Math.toRadians = function (degrees) {
	return (degrees * (Math.PI / 180));
};

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


// Load Country Json
xhr("/geoJson/countries.geo.json", { json: true }, function(countriesJson) {
    L.geoJson(countriesJson, {
    	style: function(feature) {
    		return {
    			color: "#444",
    			fillOpacity: 0
    		};
    	}
    })
});

/*
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
*/


// map.on('contextmenu', drawCircle);

map.on('click', addArrowSegment);


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
	arrowPolyline.addLatLng(mouseEvent.latlng);
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