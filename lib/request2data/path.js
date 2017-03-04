#!/usr/bin/env node

'use strict';

/*
 * path: '/'
 * path: '/fileName.fileExtension'
 * path: '/directory/'
 * path: '/directory/fileName.fileExtension'
 * path: '/directory/.../directory/'
 * path: '/directory/.../directory/fileName.fileExtension'
 *
 * */

const uf = require('util').format;
const url = require('url');
const zt = require('ztype');

const re = /^.*?[\.][^\.]+$/;

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const U = url.parse(R.url, false);
	let path = zt.ab(U.pathname, {
		s: zt.self,
		else: '/'
	});
	path = path.toLowerCase()
		.split('/')
		.map(function (path) {
			return path.trim()
		})
		.filter(function (path, index) {
			return path.length > 0;
		});
	path = [''].concat(path);
	path = path.concat(re.test(path[path.length - 1]) ? [] : ['']);
	path = path.join('/');
	Object.freeze(path);
	return path;
};
