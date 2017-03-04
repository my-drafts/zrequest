#!/usr/bin/env node

'use strict';

/*
 * port: 80
 *
 * */

const zt = require('ztype');

const re = [
	/^([^\:]+)$/,
	/^[^\:]+(?:[\:]([\d]*))?$/
];

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const HH = R.headers;
	let port = zt.ab(HH['host'], {
			s: zt.self,
			else: 'localhost:80'
		})
		.trim()
		.replace(re[0], '$1:80')
		.toLowerCase()
		.replace(re[1], '$1');
	port = Number(port);
	Object.freeze(port);
	return port;
};
