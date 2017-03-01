#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
 *
 * {
 * 		key1: value1,
 * 	  ...
 * }
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\;][\s]*/,
	/^(.+?)[\=](.*?)$/
];

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const decode = decodeURI;
	const cookie = zt.al(HH['cookie'], {
			s: HH['cookie'],
			else: ''
		})
		.trim()
		.split(re[0])
		.reduce(function (all, one) {
			const buffer = (new Buffer(one/*, 'ascii'*/)).toString('utf8');
			if (re[1].test(buffer)) {
				const m = re[1].exec(buffer);
				const key = decode(m[1]);
				const value = decode(m[2]);
				if (!(key in all)) {
					all[key] = value;
				}
				else if (!zt.as(all[key]).a) {
					all[key] = [all[key]].concat(value);
				}
				else {
					all[key] = all[key].concat(value);
				}
			}
			return all;
		}, {});
	Object.freeze(cookie);
	return cookie;
};
