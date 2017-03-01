#!/usr/bin/env node

'use strict';

/*
 * '/'
 * '/directory/'
 * '/directory/.../directory/'
 *
 * */

const path = require('./path');

const re = /^[\/](.*?)[\/]?$/;

module.exports = function (request) {
	const paths = path(request).replace(re, '$1').split('/');
	Object.freeze(paths);
	return paths;
};
