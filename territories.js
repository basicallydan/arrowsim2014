var L = require('leaflet');
var xhr = require('xhr-browserify');

var territoryInfoControl = L.control();

var territoryLayerGroup;
var selectedTerritory;
var map;

var styles = {
	red : {
		base : {
			stroke: false,
			fillColor: 'red',
			fillOpacity: 0.2
		},
		highlight : {
			stroke: false,
			fillColor: "red",
			fillOpacity: 0.5
		},
		selected : {
			stroke: false,
			fillColor: "red",
			fillOpacity: 0.7
		}
	},
	blue : {
		base : {
			stroke: false,
			fillColor: 'blue',
			fillOpacity: 0.2
		},
		highlight : {
			stroke: false,
			fillColor: "blue",
			fillOpacity: 0.5
		},
		selected : {
			stroke: false,
			fillColor: "blue",
			fillOpacity: 0.7
		}
	},
	neutral : {
		base : {
			stroke: false,
			fillOpacity: 0
		},
		highlight : {
			stroke: false,
			fillColor: "#333",
			fillOpacity: 0.5
		},
		selected : {
			stroke: false,
			fillColor: "#333",
			fillOpacity: 0.8
		}
	}
};

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
	var owner = territory.feature.properties.owner;
	territory.setStyle(styles[owner].highlight);

	if (!L.Browser.ie && !L.Browser.opera) {
		territory.bringToFront();
	}
}

function selectTerritory(territory) {

	var owner = territory.feature.properties.owner;
	territory.setStyle(styles[owner].selected);

	if (!L.Browser.ie && !L.Browser.opera) {
		territory.bringToFront();
	}
}

function resetTerritory(territory) {
	if (territory){
		territoryLayerGroup.resetStyle(territory);
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


/* Exports */
function getSelectedTerritory() {
	return selectedTerritory;
}

function getTerritory(territoryId) {
	var territories = territoryLayerGroup.getLayers();
	for (territory in territories){
		if ( territory.feature.id === territoryId) {
			return territory;
		}
	}
}

function captureTerritory(territoryId, owner) {
	var territories = territoryLayerGroup.getLayers();
	for (var i in territories){
		var territory = territories[i];
		if ( territory.feature.id === territoryId) {
			territory.feature.properties.owner = owner;
			if (territory === selectedTerritory) {
				territory.setStyle(styles[owner].selected);
			} else {
				territory.setStyle(styles[owner].highlight);
			}
			return;
		}
	}
}

function load(inputMap) {
	map = inputMap;
	xhr("/geoJson/countries.geo.json", { json: true }, function(countriesJson) {
		territoryLayerGroup = L.geoJson(countriesJson, {
			style: function(feature) {
				var owner = feature.properties.owner || 'neutral';
				return styles[owner].base;
			},
			onEachFeature: function(feature, layer){
				feature.properties.owner = 'neutral';
				layer.on({
					mouseover: mouseoverTerritoryEvent,
					mouseout: mouseOutTerritoryEvent,
					click: clickTerritoryEvent,
					contextmenu: function randomlyCaptureTerritory() {
						var teams = ['blue', 'red', 'neutral'];
						var randomTeam = teams[Math.floor(Math.random()*teams.length)]
						captureTerritory(feature.id, randomTeam);
					}
				})
			}
		}).addTo(map);
	});
}

module.exports = {
	getSelectedTerritory: getSelectedTerritory,
	getTerritory: getTerritory,
	captureTerritory: captureTerritory,
	load: load
}
