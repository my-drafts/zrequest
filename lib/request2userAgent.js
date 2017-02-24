#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 *
 * {
 *   agent: string = '?',
 *   userAgent: string = ''
 * }
 *
 * */

const zt = require('ztype');

const string2userAgent = function (a) {
	let agent = '?';
	if (a.match(/Firefox[\/][\.\d]+/i) && !a.match(/Seamonkey[\/][\.\d]+/i)) {
		agent = 'firefox';
	}
	else if (a.match(/Seamonkey[\/][\.\d]+/i)) {
		agent = 'seamonkey';
	}
	else if (a.match(/Chrome[\/][\.\d]+/i) && !a.match(/Chromium[\/][\.\d]+/i)) {
		agent = 'chrome';
	}
	else if (a.match(/Chromium[\/][\.\d]+/i)) {
		agent = 'chromium';
	}
	else if (a.match(/Safari[\/][\.\d]+/i) && !a.match(/(?:Chrome|Chromium)[\/][\.\d]+/i)) {
		agent = 'safari';
	}
	else if (a.match(/(?:Opera|OPR)[\/][\.\d]+/i)) {
		agent = 'opera';
	}
	else if (a.match(/[\;]MSIE[\s]*[\.\d]+[\;]/i)) {
		agent = 'ie';
	}
	return {
		agent: agent,
		userAgent: a
	};
};

const request2userAgent = function (request, _default) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const h = 'user-agent';
	const A = zt.al(HH[h], {
		s: string2userAgent,
		else: false
	});
	const agent = zt.al(A, {
		o: A,
		else: string2userAgent(_default)
	});
	Object.freeze(agent);
	return agent;
};

module.exports = request2userAgent;
