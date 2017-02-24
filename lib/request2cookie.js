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
	/[\s]*[\;][\s]*/i,
	/^(.+?)[\=](.*?)$/ig
];

const string2cookie = function (C) {
	const F = C.trim().split(re[0]).map(function (c) {
		const buffer = (new Buffer(c, 'ascii')).toString('utf8');
		if (re[1].test(buffer)) {
			const m = re[1].exec(buffer);
			return {
				[m[1]]: m[2]
			};
		}
		else {
			return false;
		}
	}).filter(function (c) {
		return c;
	});
	return F.length > 0 ? Object.assign.apply({}, F) : {};
};

const request2cookie = function (request, _default) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const h = 'cookie';
	const C = zt.al(HH[h], {
		s: string2cookie,
		else: {}
	});
	const cookie = Object.keys(C).length > 0 ? C : string2cookie(_default);
	Object.freeze(cookie);
	return cookie;
};

module.exports = request2cookie;
