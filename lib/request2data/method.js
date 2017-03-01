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

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const method = zt.al(R.method, {
			s: R.method,
			else: '*'
		})
		.trim()
		.toLowerCase();
	Object.freeze(method);
	return method;
};
