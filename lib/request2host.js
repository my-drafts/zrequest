#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host
 *
 * host: string = '*'
 *
 * */

 const zt = require('ztype');

const re = /^([^\:]+)(?:[\:]([\d]+))?$/ig;

const string2host = function(h){
	return h.trim().toLowerCase().replace(re, '$1');
};

const request2host = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const h = 'host';
	const H = zt.al(HH[h], { s: string2host, else: '' });
	const host = H.length>0 ? H : string2host(_default);
	Object.freeze(host);
	return host;
};

module.exports = request2host;
