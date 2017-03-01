#!/usr/bin/env node

'use strict';

/*
 * statusCode: number = 0
 *
 * */

const zt = require('ztype');

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const statusCode = zt.al(R.statusCode, {
		n: R.statusCode,
		else: 0
	});
	Object.freeze(statusCode);
	return statusCode;
};
