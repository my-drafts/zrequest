#!/usr/bin/env node

'use strict';

/*
 * {
 *   posts: {field: [value, ...], ...},
 * }
 *
 * */

const re = [
	/[\r][\n]/i,
	/^([^\=]+)[\=](.*)$/
];

module.exports = function (zrequest, options) {
	const Z = zrequest;
	const R = Z.request;
	const O = options;
	const decode = decodeURI;
	return new Promise(function (resolve, reject) {
		if (O.postsEnable === false) {
			resolve({});
			return;
		}
		let body = [];
		let bodyLength = 0;
		R.on('error', function (error) {
			reject(error);
		});
		R.on('data', function (chunk) {
			const chunkLength = chunk.length;
			if (O.postsSize > 0 && (bodyLength + chunkLength) > O.postsSize) {
				R.connection.destroy();
				reject(new Error('Posts too big'));
			}
			else {
				body.push(chunk);
				bodyLength += chunkLength;
			}
		});
		R.on('end', function () {
			body = Buffer.concat(body).toString(O.postsEncoding);
			const posts = body.split(re[0])
				.reduce(function (all, one) {
					if (!re[1].test(one)) return all;
					const m = re[1].exec(one);
					const key = decode(m[1]);
					const value = decode(m[2]);
					if (value.length === 0 && O.postsSkipEmpty === true) return all;
					all[key] = [].concat(key in all ? all[key] : [], value);
					return all;
				}, {});
			Object.freeze(posts);
			if (O.postsAmount > 0 && Object.keys(posts).length > O.postsAmount) {
				reject(new Error('Posts has too many keys'));
			}
			else {
				resolve({
					posts: posts
				});
			}
		});
	});
};
