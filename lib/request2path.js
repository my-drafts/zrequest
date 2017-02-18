#!/usr/bin/env node

'use strict';

/*
 * path: string = '/'
 *
 * */

const url = require('url');
const zt = require('ztype');

const re = /^.+?[\.][^\.]+$/ig;

const pathMap = function(path, index){
	return path.trim();
};

const pathFilter = function(path, index){
	return path.length>0;
};

const pathFix = function(p){
	return [].concat([''], p, p.length>0 && re.test(p[p.length-1]) ? [] : ['']);
};

const string2path = function(p){
	return pathFix(p.toLowerCase().split('/').map(pathMap).filter(pathFilter));
};

const request2path = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const U = url.parse(R.url, true);
	const P = zt.al(U.pathname, { s: string2path, else: [] });
	const path = P.length>0 ? P.join('/') : _default;
	return path;
};

module.exports = request2path;
