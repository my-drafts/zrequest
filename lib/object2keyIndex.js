#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const object2keyIndex = function (object, key, index, flagA) {
	const object2value = function (array, index) {
		return array[(index % array.length + array.length) % array.length];
	};
	const object2index = function (object) {
		// return all with out index as array
		const _default = flagA === false ? object : [object]; // object
		const o2v = function (index) {
			return object2value(object, index);
		};
		return zt.al(index, {
			n: o2v,
			else: _default
		});
	};
	const object2key = function (object) {
		// return all with out index as array
		const _defualt = flagA === false ? object[key] : [object[key]]; // object[key];
		return zt.al(object[key], {
			a: object2index,
			else: _defualt
		});
	};
	return zt.al(object, {
		o: object2key,
		else: undefined
	});
};

module.exports = object2keyIndex;
