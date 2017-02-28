#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 *
 * {
 *   header: value,
 *   ...
 * }
 *
 * */

const zt = require('ztype');

const request2headers = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const H = zt.al(R.headers, {
		o: object2headers,
		else: {}
	});
	const headers = Object.keys(H).map(function (h) {
		return {
			[h.toLowerCase()]: String(H[h]).toLowerCase()
		};
	});
	Object.freeze(headers);
	return headers;
};

module.exports = request2headers;
