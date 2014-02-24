// Lil bit of useful polyfill...
if (typeof(Function.prototype.inherits) === 'undefined') {
	Function.prototype.inherits = function(parent) {
		this.prototype = Object.create(parent.prototype);
	};
}