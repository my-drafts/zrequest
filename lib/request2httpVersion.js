#!/usr/bin/env node

'use strict';

/*
 * httpVersion: string = '?'
 *
 * */

 const zt = require('ztype');

const request2httpVersion = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const r = 'httpVersion';
	const V = zt.al(R[r], { s: R[r], else: '' });
	const version = V.length>0 ? V : _default;
	return version;
};

module.exports = request2httpVersion;
