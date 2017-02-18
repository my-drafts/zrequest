#!/usr/bin/env node

'use strict';

/*
 * statusCode: number = 0
 *
 * */

const zt = require('ztype');

const request2statusCode = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const r = 'statusCode';
	const C = zt.al(R[r], { n: R[r], else: 0 });
	const statusCode = C>0 ? C : _default;
	return statusCode;
};

module.exports = request2statusCode;
