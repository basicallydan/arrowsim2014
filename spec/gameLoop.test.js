var vows = require('vows');
var assert = require('assert');
var GameLoop = require('../gameLoop');

// Create a Test Suite
vows.describe('new GameLoop').addBatch({
	'when setting only one interval': {
		topic: function () {
			var loop = new GameLoop();
			loop.on('1000', function () {});
			return loop.intervalLength;
		},

		'we get 1000ms': function (topic) {
			assert.equal(topic, 1000);
		}
	},
	'when setting two intervals with a common denominator': {
		topic: function () {
			var loop = new GameLoop();
			loop.on('1000', function () {});
			loop.on('600ms', function () {});
			return loop.intervalLength;
		},

		'we get 200ms': function (topic) {
			assert.equal(topic, 200);
		}
	},
	'when setting two intervals with different types': {
		topic: function () {
			var loop = new GameLoop();
			loop.on('2s', function () {});
			loop.on('1m', function () {});
			return loop.intervalLength;
		},

		'we get 2000ms': function (topic) {
			assert.equal(topic, 2000);
		}
	}
}).run();