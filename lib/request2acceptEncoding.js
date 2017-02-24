#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
 *
 * [
 * 	{
 * 		encoding: string
 * 		q: number [0, 1]
 * 	},
 * 	...
 * ]
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\,][\s]*/i,
	/^(.+?)[\s]*[\;][\s]*q[\=]([\d\.]+)$/i
];

const string2acceptEncoding = function (E) {
	return E.trim().toLowerCase().split(re[0]).map(function (e) {
		const m = re[1].test(e) ? re[1].exec(e) : false;
		return {
			encoding: m ? m[1] : e,
			q: m ? Number(m[2]) : 1
		};
	}).sort(function (e1, e2) {
		if (e1.q > e2.q) {
			return -1;
		}
		else if (e1.q < e2.q) {
			return 1;
		}
		else {
			return 0;
		}
	}).map(function (e) {
		Object.freeze(e);
		return e;
	});
};

const request2acceptEncoding = function (request, _default) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const h = 'accept-encoding';
	const E = zt.al(HH[h], {
		s: string2acceptEncoding,
		else: []
	});
	const encoding = E.length > 0 ? E : string2acceptEncoding(_default);
	Object.freeze(encoding);
	return encoding;
};

module.exports = request2acceptEncoding;
