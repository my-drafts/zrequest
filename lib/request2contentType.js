#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
 *
 * {
 *   mime: string,
 *   ...
 *   key1: value1,
 *   ...
 * }
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\;][\s]*/i,
	/^(.+?)[\/](.+?)$/i,
	/^(.+?)[\=](.+?)$/i
];

const request2contentType = function (request) {
  const R = zt.al(request, {
    o: request,
    else: {}
  });
  const HH = zt.al(R.headers, {
    o: R.headers,
    else: {}
  });
  const h = 'content-type';
  const type = zt.al(HH[h], {
    s: HH[h],
    else: '-/-'
  }).trim().toLowerCase().split(re[0]).map(function (t, index) {
    if (re[1].test(t)) {
      return {
        key: 'mime',
        value: t
      };
    }
    else if (re[2].test(t)) {
      const m = re[2].exec(t);
      return {
        key: m[1],
        value: m[2]
      };
    }
    else {
      return {
        key: index,
        value: t
      };
    }
  }).reduce(function (TYPE, type) {
    TYPE[type.key] = type.value;
    return TYPE;
  }, {});
  Object.freeze(type);
  return type;
};

module.exports = request2contentType;
