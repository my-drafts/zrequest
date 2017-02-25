#!/usr/bin/env node

'use strict';

const fs = require('fs');
const zt = require('ztype');

const bindUploadCleant = function (zrequest, property) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R.uploadClean = function () {
		const items = Object.keys(R[property]).map(function (field) {
			return R[property][field].map(function (file) {
				return file.path;
			});
		});
		const paths = [].concat.apply([], items).map(function (path) {
			return new Promise(function (resolve, reject) {
				fs.unlink(path, function (error) {
					error ? reject(error) : resolve(path);
				});
			});
		});
		return Promise.all(paths);
	};
	Object.freeze(R.uploadClean);
};

module.exports = bindUploadCleant;
