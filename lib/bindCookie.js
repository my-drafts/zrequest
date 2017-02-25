#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const bindCookie = function (zrequest, property) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R.cookie = function (key, index) {
		return object2keyIndex(R[property], key, index, true);
	};
	Object.freeze(R.cookie);
};

module.exports = bindCookie;
