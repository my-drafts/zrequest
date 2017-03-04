#!/usr/bin/env node

'use strict';

/*
 * method: '*'
 * method: 'get'
 * method: 'post'
 * method: 'put'
 * method: '...'
 *
 * */

const zt = require('ztype');

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const method = zt.ab(R.method, {
			s: zt.self,
			else: '*'
		})
		.trim()
		.toLowerCase();
	Object.freeze(method);
	return method;
};
