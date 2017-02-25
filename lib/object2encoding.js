#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const result2return = function (result, it) {
	if (it === 1) {
		return [result];
	}
	else {
		return result;
	}
};

const object2encoding = function (object, encoding, iteration) {
	const O = zt.as(object);
	const it = zt.al(iteration, {
		n: iteration,
		else: 0
	});
	if (O.s) {
		const data = decodeURI(object);
		const buffer = new Buffer(data);
		const result = buffer.toString(encoding);
		return result2return(result, it);
	}
	else if (O.a) {
		return object.map(function (o) {
			return object2encoding(o, encoding, it + 1);
		});
	}
	else if (O.o) {
		const items = Object.keys(object).map(function (o) {
			const key = object2encoding(o, encoding, 0);
			const value = object2encoding(object[o], encoding, it + 1);
			return {
				[key]: value
			};
		});
		const result = items.length > 0 ? Object.assign.apply({}, items) : {};
		return result2return(result, it);
	}
	else {
		const data = object;
		const result = data;
		return result2return(result, it);
	}
};

module.exports = object2encoding;
