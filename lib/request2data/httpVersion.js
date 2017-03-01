#!/usr/bin/env node

'use strict';

/*
 * httpVersion: '?'
 * httpVersion: '1.0'
 * httpVersion: '1.1'
 *
 * */

const zt = require('ztype');

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const version = zt.al(R.httpVersion, {
			s: R.httpVersion,
			else: '?'
		})
		.trim()
		.toLowerCase();
	Object.freeze(version);
	return version;
};
