#!/usr/bin/env node

'use strict';

/*
 * statusMessage: ''
 *
 * */

const zt = require('ztype');

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const statusMessage = zt.al(R.statusMessage, {
		s: R.statusMessage,
		else: ''
	});
	Object.freeze(statusMessage);
	return statusMessage;
};
