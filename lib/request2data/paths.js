#!/usr/bin/env node

'use strict';

/*
 * '/'
 * '/directory/'
 * '/directory/.../directory/'
 *
 * */

const re = /^[\/](.*?)[\/]?$/;

module.exports = function (zrequest) {
	const Z = zrequest;
	const paths = Z.path.replace(re, '$1').split('/').filter(function (path) {
		return path.length > 0;
	});
	Object.freeze(paths);
	return paths;
};
