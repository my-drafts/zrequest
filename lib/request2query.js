#!/usr/bin/env node

'use strict';

/*
 * {
 *   key: value,
 *   ...
 * }
 *
 * */

const url = require('url');
const zt = require('ztype');

const request2query = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const U = url.parse(R.url, true);
	const u = 'query';
	const Q = zt.al(U[u], { o: U[u], else: {} });
	const requestQuery = Object.keys(Q).length>0 ? Q : _default;
	return requestQuery;
};

module.exports = request2query;
