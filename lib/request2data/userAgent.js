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
	else if (a.match(/Seamonkey[\/][\.\d]+/i)) {
		return 'seamonkey';
	}
	else if (a.match(/Chrome[\/][\.\d]+/i) && !a.match(/Chromium[\/][\.\d]+/i)) {
		return 'chrome';
	}
	else if (a.match(/Chromium[\/][\.\d]+/i)) {
		return 'chromium';
	}
	else if (a.match(/Safari[\/][\.\d]+/i) && !a.match(/(?:Chrome|Chromium)[\/][\.\d]+/i)) {
		return 'safari';
	}
	else if (a.match(/(?:Opera|OPR)[\/][\.\d]+/i)) {
		return 'opera';
	}
	else if (a.match(/[\;]MSIE[\s]*[\.\d]+[\;]/i)) {
		return 'ie';
	}
	return '?';
};

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	let agent = zt.al(HH['user-agent'], {
		s: HH['user-agent'],
		else: ''
	});
	agent = {
		agent: browser(agent),
		userAgent: agent
	};
	Object.freeze(agent);
	return agent;
};
