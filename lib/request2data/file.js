#!/usr/bin/env node

'use strict';

/*
 * 'fileNameWithExtension'
 *
 * */

const re = /^.*[\/]([^\/]*)$/;

module.exports = function (zrequest) {
	const Z = zrequest;
	const file = Z.path.replace(re, '$1');
	Object.freeze(file);
	return file;
};
