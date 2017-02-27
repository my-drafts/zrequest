#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *   QUERY = {field: [value, ...], ...},
 * }
 *
 * */

const zt = require('ztype');

const object2encoding = require('./object2encoding');

const OPTIONS = {
	amount: 100, // query fields amount: 100
	encoding: 'utf8', // query fields data encoding: utf8
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
			const queries = object2encoding(R[r], O.encoding);
			// application/x-www-form-urlencoded
			R.QUERY = Object.assign(R.QUERY, queries);
			Object.freeze(R.QUERY);
			resolve(R);
		}
	});
};

module.exports = ZRequestQuery;
