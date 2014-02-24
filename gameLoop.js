require('./polyfills');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var intervalParser = /([0-9]+)(ms|s|m|h)?/;

function greatestCommonFactor(intervals) {
	var sumOfModuli = 1;
	var interval = _.min(intervals);
	while (sumOfModuli !== 0) {
		sumOfModuli = _.reduce(intervals, function(memo, i){ return memo + (i % interval); }, 0);
		if (sumOfModuli !== 0) {
			interval -= 10;
		}
	}
	return interval;
}

function GameLoop() {
	this.intervalId = undefined;
	this.intervalLength = undefined;
	this.intervalsToEmit = [];
	this.on('newListener', function (e) {
		var intervalGroups = intervalParser.exec(e);
		var intervalAmount = +intervalGroups[1];
		var intervalType = intervalGroups[2] || 'ms';
		if (intervalType === 's') {
			intervalAmount = intervalAmount * 1000;
		} else if (intervalType === 'm') {
			intervalAmount = intervalAmount * 1000 * 60;
		} else if (intervalType === 'h') {
			intervalAmount = intervalAmount * 1000 * 60 * 60;
		} else if (!!intervalType && intervalType !== 'ms') {
			console.warn('You can only specify intervals of ms, s, m, or h');
			return false;
		}
		if (intervalAmount < 10 || intervalAmount % 10 !== 0) {
			// We only deal in 10's of milliseconds for simplicity
			console.warn('You can only specify 10s of milliseconds, trust me on this one');
			return false;
		}

		this.intervalsToEmit.push(intervalAmount);

		this.intervalLength = greatestCommonFactor(this.intervalsToEmit);

		// We assume that they mean ms if they don't specify
		console.log('Now emitting event every', intervalAmount, 'milliseconds and the interval length is', this.intervalLength);
	});
}

GameLoop.inherits(EventEmitter);

GameLoop.prototype.start = function () {
	if (!this.intervalLength) {
		return console.warn('You haven\'t specified any interval callbacks. Use gameLoop.on(\'500ms\', function () { ... }) to do so, and then you can start');
	}
	this.intervalId = setInterval(function () {

	}, this.intervalLength);
};

GameLoop.prototype.stop = function () {
	clearInterval(this.intervalId);
};

module.exports = GameLoop;