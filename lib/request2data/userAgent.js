#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 *
 * {
 *   agent: '?',
 *   userAgent: ''
 * }
 *
 * */

const zt = require('ztype');

const browser = function (a) {
	if (a.match(/Firefox[\/][\.\d]+/i) && !a.match(/Seamonkey[\/][\.\d]+/i)) {
		return 'firefox';
	}
	if (a.match(/Seamonkey[\/][\.\d]+/i)) {
		return 'seamonkey';
	}
	if (a.match(/Chrome[\/][\.\d]+/i) && !a.match(/Chromium[\/][\.\d]+/i)) {
		return 'chrome';
	}
	if (a.match(/Chromium[\/][\.\d]+/i)) {
		return 'chromium';
	}
	if (a.match(/Safari[\/][\.\d]+/i) && !a.match(/(?:Chrome|Chromium)[\/][\.\d]+/i)) {
		return 'safari';
	}
	if (a.match(/(?:Opera|OPR)[\/][\.\d]+/i)) {
		return 'opera';
	}
	if (a.match(/[\;]MSIE[\s]*[\.\d]+[\;]/i)) {
		return 'ie';
	}
	return '?';
};

module.exports = function (zrequest) {
	const Z = zrequest;
	const R = Z.request;
	const HH = R.headers;
	let agent = zt.ab(HH['user-agent'], {
		s: zt.self,
		else: ''
	});
	agent = {
		agent: browser(agent),
		userAgent: agent
	};
	Object.freeze(agent);
	return agent;
};
