#!/usr/bin/env node

'use strict';

/*
 * statusCode: number = 0
 *
 * */

const zt = require('ztype');

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const statusCode = zt.ab(R.statusCode, {
		n: zt.self,
		else: 0
	});
	Object.freeze(statusCode);
	return statusCode;
};
