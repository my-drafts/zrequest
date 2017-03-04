#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
 *
 * {
 *   mime: string,
 *   ...
 *   key1: value1,
 *   ...
 * }
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\;][\s]*/,
	/^(.+?)[\/](.+?)$/,
	/^(.+?)[\=](.+?)$/
];

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const HH = R.headers;
	const type = zt.ab(HH['content-type'], {
			s: zt.self,
			else: '-/-'
		})
		.trim()
		.toLowerCase()
		.split(re[0])
		.map(function (t, index) {
			if (re[1].test(t)) {
				return {
					key: 'mime',
					value: t
				};
			}
			else if (re[2].test(t)) {
				const m = re[2].exec(t);
				return {
					key: m[1],
					value: m[2]
				};
			}
			else {
				return {
					key: index,
					value: t
				};
			}
		})
		.reduce(function (all, one) {
			all[one.key] = one.value;
			return all;
		}, {});
	Object.freeze(type);
	return type;
};
