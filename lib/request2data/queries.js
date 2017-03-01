#!/usr/bin/env node

'use strict';

/*
 * {
 *   key: [value, ...],
 *   ...
 * }
 *
 * */

const url = require('url');
const zt = require('ztype');

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const U = url.parse(R.url, true);
	let query = zt.al(U.query, {
		o: U.query,
		else: {}
	});
	query = Object.keys(query)
		.reduce(function (all, key) {
			return Object.assign(all, {
				[key]: zt.al(query[key], {
					a: query[key],
					else: [query[key]]
				})
			});
		}, {});
	Object.freeze(query);
	return query;
};
