#!/usr/bin/env node

'use strict';

/*
 * port: number = 0
 *
 * */

const zt = require('ztype');

const re = /^([^\:]+)(?:[\:]([\d]+))?$/ig;

const string2port = function(p){
	const P = p.trim().toLowerCase().replace(re, '$2');
	const port = Number(P);
	return port>0 ? port : 0;
};

const request2port = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const h = 'host';
	const P = zt.al(HH[h], { s: string2port, else: 0 });
	const port = P>0 ? P : _default;
	return port;
};

module.exports = request2port;
