#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const bindUpload = function (zrequest, property) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R.upload = function (key, index) {
		return object2keyIndex(R[property], key, index, true);
	};
	Object.freeze(R.upload);
};

module.exports = bindUpload;
