var L = require('leaflet');
var xhr = require('xhr-browserify');

var territoryInfoControl = L.control();

var territoryLayerGroup;
var selectedTerritory;
var map;
var _ = require('underscore');
var Territory = require('./territory');

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
};

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
	if (territory) {
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

function getTerritoryLayer(territoryId) {
	var territoryLayers = territoryLayerGroup.getLayers();
	return _.find(territoryLayers, function (t) {
		return t.feature.id === territoryId;
	});
}

function captureTerritory(territory, owner) {
	var territoryLayer = getTerritoryLayer(territory.id);
	territoryLayer.feature.properties.owner = owner;
	if (territoryLayer === selectedTerritory) {
		territoryLayer.setStyle(styles[owner].selected);
	} else {
		territoryLayer.setStyle(styles[owner].highlight);
	}
}

function load(inputMap) {
	map = inputMap;
	xhr("/geoJson/countries.geo.json", { json: true }, function (countriesJson) {
		territoryLayerGroup = L.geoJson(countriesJson, {
			style: function(feature) {
				var owner = feature.properties.owner || 'neutral';
				return styles[owner].base;
			},
			onEachFeature: function(feature, layer){
				var territory = new Territory(feature, layer);
				territory.on('capture', captureTerritory);
				feature.properties.owner = 'neutral';
				feature.properties.territory = territory;
				layer.on({
					mouseover: mouseoverTerritoryEvent,
					mouseout: mouseOutTerritoryEvent,
					click: clickTerritoryEvent,
					contextmenu: function randomlyCaptureTerritory () {
						// var randomTeam = teams[_.random(0, teams.length - 1)];
						// captureTerritory(feature.id, randomTeam);
						var teams = ['blue', 'red', 'neutral'];
						territory.captureBy(teams[_.random(0, teams.length - 1)]);
					}
				});
			}
		});

		territoryLayerGroup.addTo(map);
	});
}

module.exports = {
	getSelectedTerritory: getSelectedTerritory,
	getTerritoryLayer: getTerritoryLayer,
	captureTerritory: captureTerritory,
	load: load
};
