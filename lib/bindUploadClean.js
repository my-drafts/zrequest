#!/usr/bin/env node

'use strict';

const fs = require('fs');
const zt = require('ztype');

const bindUploadCleant = function (zrequest, property) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R.uploadClean = function (options) {
		const O = zt.al(options, {
			o: options,
			else: {}
		});
		const skip = zt.al(O.skip, {
			a: a => a.length == 2 ? new RegExp(a[0], a[1]) : false,
			s: s => s.trim().length > 0 ? s.trim() : false,
			else: false
		});
		const files = Object.keys(R[property]).map(function (field) {
			return R[property][field];
		}).reduce(function (FILES, files) {
			return FILES.concat.apply(FILES, files);
		}, []).filter(function (file) {
			return zt.al(skip, {
				re: s => !s.test(file.path),
				s: s => s === file.path
			});
		});
		const promise = files.map(function (file) {
			return new Promise(function (resolve, reject) {
				fs.unlink(file.path, function (error) {
					error ? reject(error) : resolve(path);
				});
			});
		});
		return Promise.all(promise);
	};
	Object.freeze(R.uploadClean);
};

module.exports = bindUploadCleant;
