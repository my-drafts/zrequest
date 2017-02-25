#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const bindQuery = function (zrequest, property) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R.query = function (key, index) {
		return object2keyIndex(R[property], key, index, true);
	};
	Object.freeze(R.query);
};

module.exports = bindQuery;
