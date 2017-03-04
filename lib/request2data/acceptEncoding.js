#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
 *
 * [
 * 	{
 * 		encoding: 'encodingName'
 * 		q: number [0, 1]
 * 	},
 * 	...
 * ]
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\,][\s]*/,
	/^(.+?)[\s]*[\;][\s]*q[\=]([\d\.]+)$/i
];

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const HH = R.headers;
	const encoding = zt.ab(HH['accept-encoding'], {
			s: zt.self,
			else: '*'
		})
		.trim()
		.toLowerCase()
		.split(re[0])
		.map(function (e) {
			const m = re[1].test(e) ? re[1].exec(e) : false;
			return {
				q: m && Number(m[2]) >= 0 ? Number(m[2]) : 1,
				encoding: m ? m[1] : e
			};
		})
		.sort(function (e1, e2) {
			if (e1.q > e2.q) {
				return -1;
			}
			else if (e1.q < e2.q) {
				return 1;
			}
			else {
				return 0;
			}
		})
		.map(function (e) {
			Object.freeze(e);
			return e;
		});
	Object.freeze(encoding);
	return encoding;
};
