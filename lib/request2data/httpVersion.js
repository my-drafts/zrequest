#!/usr/bin/env node

'use strict';

/*
 * httpVersion: '?'
 * httpVersion: '1.0'
 * httpVersion: '1.1'
 *
 * */

const zt = require('ztype');

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const version = zt.ab(R.httpVersion, {
			s: zt.self,
			else: '?'
		})
		.trim()
		.toLowerCase();
	Object.freeze(version);
	return version;
};
