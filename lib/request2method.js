#!/usr/bin/env node

'use strict';

/*
 * method: string = '*'
 *
 * */

const zt = require('ztype');

const string2method = function (m) {
	return m.trim().toLowerCase();
};

const request2method = function (request, _default) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const r = 'method';
	const M = zt.al(R[r], {
		s: string2method,
		else: ''
	});
	const method = M.length > 0 ? M : string2method(_default);
	return method;
};

module.exports = request2method;
