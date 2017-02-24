#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
 *
 * [
 * 	{
 * 		local: string,
 * 		language: string,
 * 		q: number [0, 1]
 * 	},
 * 	...
 * ]
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\,][\s]*/i,
	/^(.+?)[\s]*[\;][\s]*q[\=]([\d\.]+)$/i,
	/^(.+?)[\-](.+?)$/i
];

const string2acceptLanguage = function (L) {
	return L.trim().toLowerCase().split(re[0]).map(function (l) {
		const m = re[1].test(l) ? re[1].exec(l) : false;
		return {
			language: m ? m[1] : l,
			local: m ? m[1] : l,
			location: m ? m[1] : l,
			q: m ? Number(m[2]) : 1
		};
	}).sort(function (l1, l2) {
		if (l1.q < l2.q) {
			return -1;
		}
		else if (l1.q > l2.q) {
			return 1;
		}
		else {
			return 0;
		}
	}).map(function (l) {
		l.language = l.language.replace(re[2], '$1');
		l.location = l.local.replace(re[2], '$2');
		Object.freeze(l);
		return l;
	});
};

const request2acceptLanguage = function (request, _default) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const h = 'accept-language';
	const L = zt.al(HH[h], {
		s: string2acceptLanguage,
		else: []
	});
	const language = L.length > 0 ? L : string2acceptLanguage(_default);
	Object.freeze(language);
	return language;
};

module.exports = request2acceptLanguage;
