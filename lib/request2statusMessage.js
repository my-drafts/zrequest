#!/usr/bin/env node

'use strict';

/*
 * statusMessage: string = ''
 *
 * */

const zt = require('ztype');

const request2statusMessage = function (request, _default) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const r = 'statusMessage';
	const M = zt.al(R[r], {
		s: R[r],
		else: ''
	});
	const statusMessage = M.length > 0 ? M : _default;
	return statusMessage;
};

module.exports = request2statusMessage;
