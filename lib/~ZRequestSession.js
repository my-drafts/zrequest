#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *   SESSION = {key: value, ...},
 * }
 *
 * */

const zt = require('ztype');

const object2encoding = require('./object2encoding');

const OPTIONS = {
	cookieName: '', // session id name
	timeToLive: 60*15, // session time to live: 15 min
	size: 8 * 1024 // query fields data summery size: 8kb
};

const ZRequestQuery = function (zrequest, options) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	const O = Object.assign({}, OPTIONS, options);
	const r = 'queries';
	return new Promise(function (resolve, reject) {
		if (O.size > 0 && JSON.stringify(R[r]).length > O.size) {
			reject(new Error('Request query data too big'));
		}
		else if (O.amount > 0 && Object.keys(R[r]).length > O.amount) {
			reject(new Error('Request query data has too many keys'));
		}
		else {
			// application/x-www-form-urlencoded
			R.SESSION = Object.assign(R.SESSION, object2encoding(R[r], O.encoding));
			Object.freeze(R.GET);
			resolve(R);
		}
	});
};

module.exports = ZRequestQuery;
