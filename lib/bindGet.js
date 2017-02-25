#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const bindGet = function (zrequest, property) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R.get = function (key, index) {
		return object2keyIndex(R[property], key, index, true);
	};
	Object.freeze(R.get);
};

module.exports = bindGet;
