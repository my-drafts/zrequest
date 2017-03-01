#!/usr/bin/env node

'use strict';

/*
 * '/'
 * '/directory/'
 * '/directory/.../directory/'
 *
 * */

const path = require('./path');

const re = /^(.*[\/])[^\/]*$/;

module.exports = function (request) {
	const directory = path(request).replace(re, '$1');
	Object.freeze(directory);
	return directory;
};
