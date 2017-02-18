#!/usr/bin/env node
'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges
 *
 * Ranges: { bytes | none }
 *
 * */

const zt = require('ztype');

const string2ranges = function(R){
	return R.trim().toLowerCase();
};

const request2acceptRanges = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const h = 'accept-ranges';
	const R = zt.al(HH[h], { s: string2ranges, else: '' });
	const ranges = C.length>0 ? C : _default;
	Object.freeze(ranges);
	return ranges;
};

module.exports = request2acceptRanges;
