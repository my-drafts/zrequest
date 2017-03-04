#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges
 *
 * Ranges: { bytes | none }
 *
 * */

const zt = require('ztype');

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const HH = R.headers;
	const ranges = zt.ab(HH['accept-ranges'], {
			s: zt.self,
			else: ''
		})
		.trim()
		.toLowerCase();
	Object.freeze(ranges);
	return ranges;
};
