#!/usr/bin/env node

'use strict';

const zt = require('ztype');

const bindSession = function (zrequest, property) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R.sessionGet = function (key) {
		if (zt.as(R[property]).o && key in R[property]) {
			return R[property][key];
		}
		else {
			return undefined;
		}
	}
	//Object.freeze(R.sessionGet);
	R.sessionSet = function (key, value) {
		if (zt.as(R[property]).o) {
			if (key in R[property]) {
				console.log('Session: ', R[property][key], ' -> ', value);
			}
			R[property][key] = value;
		}
	}
	//Object.freeze(R.sessionSet);
	R.sessionUnset = function (key) {
		if (zt.as(R[property]).o && key in R[property]) {
			R[property][key] = undefined;
			delete R[property][key];
		}
	}
	//Object.freeze(R.sessionUnset);
	R.session = function (key, options) {
		const O = zt.al(options, {
			o: options,
			else: {}
		});
		if ('unset' in O && !!O.unset) {
			return R.sessionUnset(key);
		}
		else if ('set' in O) {
			return R.sessionSet(key, O.set);
		}
		else {
			return R.sessionGet(key);
		}
	};
	Object.freeze(R.session);
};

module.exports = bindQuery;
