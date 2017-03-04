#!/usr/bin/env node

'use strict';

/*
 * statusMessage: ''
 *
 * */

const zt = require('ztype');

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const statusMessage = zt.ab(R.statusMessage, {
		s: zt.self,
		else: ''
	});
	Object.freeze(statusMessage);
	return statusMessage;
};
