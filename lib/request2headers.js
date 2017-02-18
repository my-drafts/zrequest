#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 *
 * {
 *   header: value,
 *   ...
 * }
 *
 * */

 const zt = require('ztype');

const object2headers = function(H){
	const F = Object.keys(H).map(function(h){
		return [ h.toLowerCase(), H[h] ];
	}).map(function(h){
		return { [ h[0] ]: String(h[1]).toLowerCase() };
	});
	return Object.assign.apply({}, F);
};

const request2headers = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const H = zt.al(R.headers, { o: object2headers, else: {} });
	const headers = Object.keys(H).length>0 ? H : object2headers(_default);
	Object.freeze(headers);
	return headers;
};

module.exports = request2headers;
