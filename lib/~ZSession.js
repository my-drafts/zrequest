#!/usr/bin/env node

'use strict';

/*
 * ZSession{
 *   name = 'sessionId',
 *   id = false | '',
 *   mode = 'memory' | 'memoryThreads' | 'outOfProcess'
 *   load() & save() if in memory
 *   get & set & unset if out of program
 * }
 *
 * */

const zt = require('ztype');

class ZSession {
	constructor(options) {
		const O = zt.al(options, {
			o: options,
			else: {}
		});

    this._name = '';
		if () {

		}

	}
}

module.exports = ZSession;
