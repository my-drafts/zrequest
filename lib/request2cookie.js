#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
 *
 * {
 * 		key1: value1,
 * 	  ...
 * }
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\;][\s]*/i,
	/^(.+?)[\=](.*?)$/i
];

const request2cookie = function (request, _default) {
  const R = zt.al(request, {
    o: request,
    else: {}
  });
  const HH = zt.al(R.headers, {
    o: R.headers,
    else: {}
  });
  const h = 'cookie';
  const cookie = zt.al(HH[h], {
    s: HH[h],
    else: ''
  }).trim().split(re[0]).map(function (c) {
    const buffer = (new Buffer(c, 'ascii')).toString('utf8');
    if (re[1].test(buffer)) {
      const m = re[1].exec(buffer);
      return {
        key: decodeURI(m[1]),
        value: decodeURI(m[2])
      };
    }
    else {
      return false;
    }
  }).filter(function (c) {
    return c;
  }).reduce(function (COOKIE, cookie) {
    if (cookie.key in COOKIE) {
      if (zt.as(COOKIE[cookie.key]).a) {
        COOKIE[cookie.key].push(cookie.value);
      }
      else {
        COOKIE[cookie.key] = [COOKIE[cookie.key], cookie.value];
      }
    }
    else {
      COOKIE[cookie.key] = cookie.value;
    }
    return COOKIE;
  }, {});
  Object.freeze(cookie);
  return cookie;
};

module.exports = request2cookie;
