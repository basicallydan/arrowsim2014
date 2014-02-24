var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

/*
 * Territory accepts a GeoJSON object as it's first parameter
 */
function Territory(feature, layer) {
	this.id = feature.id;
	this.owner = feature.properties.owner;
	this.name = feature.properties.name;
	this.population = _.random(5000000, 30000000);
	// Per cycle
	this.growthRate = _.random(100, 500);
	this.volunteerRate = _.random(10, 30);
	// Starting army is between 1% and 30% of the population
	this.armySize = _.random(Math.floor(this.population * 0.01), Math.floor(this.population * 0.3));
}

Territory.inherits(EventEmitter);

Territory.prototype.captureBy = function(team) {
	this.owner = team;
	this.emit('capture', this, team);
};

module.exports = Territory;