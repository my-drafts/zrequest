#!/usr/bin/env node

'use strict';

/*
 * {
 *   key: value,
 *   ...
 * }
 *
 * */

const url = require('url');
const zt = require('ztype');

const request2query = function (request, _default) {
  const R = zt.al(request, {
    o: request,
    else: {}
  });
  const U = url.parse(R.url, true);
  const Q = zt.al(U.query, {
    o: U.query,
    else: {}
  });
  const requestQuery = Object.keys(Q).length > 0 ? Q : _default;
  return requestQuery;
};

module.exports = request2query;
