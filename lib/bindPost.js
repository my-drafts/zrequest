#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const bindPost = function (zrequest, property) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R.post = function (key, index) {
		return object2keyIndex(R[property], key, index, true);
	};
	Object.freeze(R.post);
};

module.exports = bindPost;
