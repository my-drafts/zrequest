#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges
 *
 * Ranges: { bytes | none }
 *
 * */

const zt = require('ztype');

const request2acceptRanges = function (request, _default) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const h = 'accept-ranges';
	const ranges = zt.al(HH[h], {
		s: HH[h],
		else: ''
	}).trim().toLowerCase();
	Object.freeze(ranges);
	return ranges;
};

module.exports = request2acceptRanges;
