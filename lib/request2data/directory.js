#!/usr/bin/env node

'use strict';

/*
 * '/'
 * '/directory/'
 * '/directory/.../directory/'
 *
 * */

const re = /^(.*[\/])[^\/]*$/;

module.exports = function (zrequest) {
	const Z = zrequest;
	const directory = Z.path.replace(re, '$1');
	Object.freeze(directory);
	return directory;
};
