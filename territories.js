var L = require('leaflet');
var xhr = require('xhr-browserify');

var territoryInfoControl = L.control();

var territoryGeoJsonLayer;
var selectedTerritory;
var map;

territoryInfoControl.onAdd = function(map) {
	var territoryProps = selectedTerritory.feature.properties;
	territoryProps.owner = territoryProps.owner || "Independent";
	this._div = L.DomUtil.create('div', 'territory-info');
	this._div.innerHTML =
		"<p>" +
			"<span class='info-header'>Territory: </span>" + territoryProps.name +
		"</p>" +
		"<p>" +
		"<span class='info-header'>Status: </span>" + territoryProps.owner +
		"</p>";
    return this._div;
}

function highlightTerritory(territory) {

	territory.setStyle({
		stroke: false,
		fillColor: "#333",
		fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        territory.bringToFront();
    }
}

function selectTerritory(territory) {

	var territoryProps = territory.feature.properties;

	territory.setStyle({
		stroke: false,
		fillColor: "#333",
		fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        territory.bringToFront();
    }
}

function resetTerritory(territory) {
	if (territory){
		territoryGeoJsonLayer.resetStyle(territory);
	}	
}

function mouseoverTerritoryEvent(e) {
	if (e.target != selectedTerritory) {
		highlightTerritory(e.target);
	}
}

function mouseOutTerritoryEvent(e) {
	if (e.target != selectedTerritory) {
		resetTerritory(e.target);
	}
}

function clickTerritoryEvent(e) {
	if (e.target === selectedTerritory) {
		resetTerritory(e.target);
		selectedTerritory = undefined;
		territoryInfoControl.removeFrom(map);
	} else {
		resetTerritory(selectedTerritory);
		if (selectedTerritory) {
			territoryInfoControl.removeFrom(map);
		}

		selectedTerritory = e.target;
		selectTerritory(e.target);
		territoryInfoControl.addTo(map);
	}
}

function load(inputMap) {
	map = inputMap;
	xhr("/geoJson/countries.geo.json", { json: true }, function(countriesJson) {
	    territoryGeoJsonLayer = L.geoJson(countriesJson, {
	    	style: function(feature) {
	    		return {
	    			stroke: false,
	    			fillOpacity: 0
	    		};
	    	},
	    	onEachFeature: function(feature, layer){
				layer.on({
					mouseover: mouseoverTerritoryEvent,
					mouseout: mouseOutTerritoryEvent,
					click: clickTerritoryEvent
				})
			}
	    }).addTo(map);
	});
}

module.exports = {
	load: load
}
