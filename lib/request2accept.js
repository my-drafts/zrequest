#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
 *
 * [
 * 	{
 * 		mime: string,
 * 		q: number [0, 1],
 * 	  subtype: string,
 * 	  type: string
 * 	},
 * 	...
 * ]
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\,][\s]*/i,
	/^(.+?)[\s]*[\;][\s]*q[\=]([\d\.]+?)$/i,
	/^(.+?)[\/](.+?)$/i
];

const string2accept = function(A){
	return A.trim().toLowerCase().split(re[0]).map(function(a){
		const m = re[1].test(a) ? re[1].exec(a) : false;
		return {
			mime: m ? m[1] : a,
			q: m ? Number(m[2]) : 1,
			subtype: m ? m[1] : '',
			type: m ? m[1] : a
		};
	}).sort(function(a1, a2){
		if(a1.q<a2.q){
			return -1;
		}
		else if(a1.q>a2.q){
			return 1;
		}
		else{
			return 0;
		}
	}).map(function(a){
		a.subtype = a.subtype.replace(re[2], '$2');
		a.type = a.type.replace(re[2], '$1');
		Object.freeze(a);
		return a;
	});
};

const request2accept = function(request, _default){
	const R = zt.al(request, { o: request, else: {} });
	const HH = zt.al(R.headers, { o: R.headers, else: {} });
	const h = 'accept';
	const A = zt.al(HH[h], { s: string2accept, else: [] });
	const accept = A.length>0 ? A : string2accept(_default);
	Object.freeze(accept);
	return accept;
};

module.exports = request2accept;
