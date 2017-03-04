#!/usr/bin/env node

'use strict';

/*
 * {
 *   key: [value, ...],
 *   ...
 * }
 *
 * */

const qs = require('querystring');
const url = require('url');

module.exports = function (zrequest, options) {
	const Z = zrequest;
	const O = options;
	const R = Z.request;
	const decode = decodeURI;
	return new Promise(function (resolve, reject) {
		if (O.queriesEnable === false) {
			resolve({});
			return;
		}
		const queriesString = url.parse(R.url, false).query || '';
		if (O.queriesSize > 0 && queriesString.length > O.queriesSize) {
			reject(new Error('Queries too big'));
			return;
		}
		const buffer = new Buffer(queriesString || '');
		const query = buffer.toString(O.queriesEncoding);
		const fields = qs.parse(query, '&', '=', {
			decodeURIComponent: decode,
			maxKeys: 0
		});
		const queries = Object.keys(fields)
			.reduce(function (all, field) {
				const key = decode(field);
				const value = [].concat(fields[field])
					.map(function (value) {
						return decode(value);
					})
					.filter(function (value) {
						return O.queriesSkipEmpty !== true|| value.length > 0;
					});
				if (value.length === 0 && O.queriesSkipEmpty === true) return all;
				all[key] = [].concat(key in all ? all[key] : [], value);
				return all;
			}, {});
		Object.freeze(queries);
		if (O.queriesAmount > 0 && Object.keys(queries).length > O.queriesAmount) {
			reject(new Error('Queries has too many keys'));
		}
		else {
			resolve(queries);
		}
	});
};
