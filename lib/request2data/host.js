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

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const HH = R.headers;
	const host = zt.ab(HH['host'], {
			s: zt.self,
			else: 'localhost:80'
		})
		.trim()
		.toLowerCase()
		.replace(re, '$1');
	Object.freeze(host);
	return host;
};
