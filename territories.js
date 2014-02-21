var L = require('leaflet');
var xhr = require('xhr-browserify');

var territoryGeoJsonLayer;
var selectedTerritory;

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
	
	territoryProps.selected = true;

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
	} else {
		selectTerritory(e.target);
		resetTerritory(selectedTerritory);
		selectedTerritory = e.target;
	}
}

function load(map) {
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
