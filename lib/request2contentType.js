#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
 *
 * {
 *   mime: string,
 *   subtype: string,
 *   type: string,
 *   ...
 *   key1: value1,
 *   ...
 * }
 *
 * */
const zt = require('ztype');

const re = [
	/[\s]*[\;][\s]*/i,
	/^(.+?)[\/](.+?)$/i,
	/^(.+?)[\=](.+?)$/i
];

const string2contentType = function (T) {
	const F = T.trim().toLowerCase().split(re[0]).map(function (t, index) {
		if (re[1].test(t)) {
			const m = re[1].exec(t);
			return {
				mime: t,
				subtype: m[2],
				type: m[1]
			};
		}
		else if (re[2].test(t)) {
			const m = re[2].exec(t);
			return {
				[m[1]]: m[2]
			};
		}
		else {
			return {
				[index]: t
			};
		}
	});
	return F.length > 0 ? Object.assign.apply({}, F) : {};
};

const request2contentType = function (request, _default) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const h = 'content-type';
	const T = zt.al(HH[h], {
		s: string2contentType,
		else: {}
	});
	const type = Object.keys(T).length > 0 ? T : string2contentType(_default);
	Object.freeze(type);
	return type;
};

module.exports = request2contentType;
