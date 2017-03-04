#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
 *
 * [
 * 	{
 * 		language: 'language',
 * 		local: 'language-localization',
 * 		q: number [0, 1]
 * 	},
 * 	...
 * ]
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\,][\s]*/,
	/^(.+?)[\s]*[\;][\s]*q[\=]([\d\.]+)$/i,
	/^(.+?)[\-](.+?)$/
];

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const HH = R.headers;
	const language = zt.ab(HH['accept-language'], {
			s: zt.self,
			else: '*'
		})
		.trim()
		.toLowerCase()
		.split(re[0])
		.map(function (l) {
			const m = re[1].test(l) ? re[1].exec(l) : false;
			return {
				q: m && Number(m[2]) >= 0 ? Number(m[2]) : 1,
				local: m ? m[1] : l
			};
		})
		.sort(function (l1, l2) {
			if (l1.q > l2.q) {
				return -1;
			}
			else if (l1.q < l2.q) {
				return 1;
			}
			else {
				return 0;
			}
		})
		.map(function (l) {
			l.language = l.local.replace(re[2], '$1');
			Object.freeze(l);
			return l;
		});
	Object.freeze(language);
	return language;
};
