#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host
 *
 * host: string = '*'
 *
 * */

const zt = require('ztype');

const re = /^([^\:]+)(?:[\:][\d]*)?$/;

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const host = zt.al(HH['host'], {
			s: HH['host'],
			else: 'localhost:80'
		})
		.trim()
		.toLowerCase()
		.replace(re, '$1');
	Object.freeze(host);
	return host;
};
