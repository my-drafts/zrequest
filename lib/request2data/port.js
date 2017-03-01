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

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	let port = zt.al(HH['host'], {
			s: HH['host'].replace(re[0], '$1:80'),
			else: 'localhost:80'
		})
		.trim()
		.toLowerCase()
		.replace(re[1], '$1');
	port = Number(port);
	Object.freeze(port);
	return port;
};
