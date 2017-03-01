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

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const U = url.parse(R.url, false);
	const path = zt.al(U.pathname, {
			s: U.pathname,
			else: '/'
		})
		.toLowerCase()
		.split('/')
		.map(function (path) {
			return path.trim()
		})
		.filter(function (path) {
			return path.length > 0;
		})
		.map(function (one, index, A) {
			const end = A.length - 1 > index || re.test(one) ? '' : '/';
			return uf('/%s%s', one, end);
		})
		.join('');
	Object.freeze(path);
	return path;
};
