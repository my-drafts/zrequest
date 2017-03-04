#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 *
 * {
 *   headerName: headerValue,
 *   ...
 * }
 *
 * */

const zt = require('ztype');

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const headers = zt.ab(R.rawHeaders, {
			o: zt.self,
			else: {}
		})
		.reduce(function (all, one) {
			if (all.length > 0 && all[0].value === false) {
				all[0].value = one;
				return all;
			}
			else {
				return [{
					key: one,
					value: false
				}].concat(all);
			}
		}, [])
		.sort(function (h1, h2) {
			return h1.key.localeCompare(h2.key);
		})
		.reduce(function (all, one) {
			return Object.assign(all, {
				[one.key]: one.value
			});
		}, {});
	Object.freeze(headers);
	return headers;
};
