#!/usr/bin/env node

'use strict';

/*
 * 'fileNameWithExtension'
 *
 * */

const path = require('./path');

const re = /^.*[\/]([^\/]*)$/;

module.exports = function (request) {
	const file = path(request).replace(re, '$1');
	Object.freeze(file);
	return file;
};
