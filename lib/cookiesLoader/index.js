#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
 *
 * {
 * 		cookieName: cookieData,
 * 	  ...
 * }
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\;][\s]*/,
	/^(.+?)[\=](.*?)$/
];

module.exports = function (zrequest, options) {
	const Z = zrequest;
	const O = options;
	const R = Z.request;
	const HH = R.headers;
	const decode = decodeURI;
	return new Promise(function (resolve, reject) {
		if (O.cookiesEnable === false) {
			resolve({});
			return;
		}
		const cookiesString = zt.ab(HH['cookie'], {
			s: zt.self,
			else: ''
		});
		if (O.cookiesSize > 0 && cookiesString.length > O.cookiesSize) {
			reject(new Error('Cookies too big'));
			return;
		}
		const cookies = (new Buffer(cookiesString))
			.toString(O.cookiesEncoding)
			.trim()
			.split(re[0])
			.reduce(function (all, one) {
				if (!re[1].test(one)) return all;
				const m = re[1].exec(one);
				const key = decode(m[1]);
				const value = decode(m[2]);
				if (value.length === 0 && O.cookiesSkipEmpty === true) return all;
				all[key] = [].concat(key in all ? all[key] : [], value);
				return all;
			}, {});
		Object.freeze(cookies);
		if (O.cookiesAmount > 0 && Object.keys(cookies).length > O.cookiesAmount) {
			reject(new Error('Cookies has too many keys'));
		}
		else {
			resolve(cookies);
		}
	});
};
