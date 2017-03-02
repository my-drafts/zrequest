#!/usr/bin/env node

'use strict';

/*
 * {
 *   posts: {field: [value, ...], ...},
 *   uploads: {field: [ZUpload, ...], ...},
 * }
 *
 * */

const multiparty = require('multiparty');

const ZUpload = require('../ZUpload');

module.exports = function (zrequest, options) {
	const Z = zrequest;
	const O = options;
	const R = Z.request;
	const Ompfd = {
		autoFields: true,
		autoFiles: true,
		encoding: O.postsEncoding,
		maxFieldsSize: O.postsSize,
		maxFields: O.postsAmount,
		maxFilesSize: O.uploadsSpace,
		uploadDir: O.uploadsDirectory
	};
	const decode = decodeURI;
	return new Promise(function (resolve, reject) {
		if (O.postsEnable === false) {
			resolve({});
			return;
		}
		const form = new multiparty.Form(Ompfd);
		// multipart/form-data
		form.parse(R, function (error, fields, files) {
			if (error) {
				reject(error);
			}
			else {
				const posts = Object.keys(fields)
					.reduce(function (all, field) {
						const key = decode(field);
						const value = [].concat(fields[field])
							.map(function (value) {
								return decode(value);
							})
							.filter(function (value) {
								return O.postsSkipEmpty !== true || value.length > 0;
							});
						if (value.length === 0 && O.postsSkipEmpty === true) return all;
						all[key] = [].concat(key in all ? all[key] : [], value);
						return all;
					}, {});
				Object.freeze(posts);
				const uploads = Object.keys(files)
					.reduce(function (all, field) {
						const key = decode(field);
						const value = [].concat(files[field])
							.map(function (value) {
								return new ZUpload(value);
							})
							.filter(function (value) {
								if (value.name.length === 0) {
									value.remove();
								}
								return O.uploadsSkipEmpty !== true || value.name.length > 0;
							});
						if (value.length === 0 && O.uploadsSkipEmpty === true) return all;
						all[key] = [].concat(key in all ? all[key] : [], value);
						return all;
					}, {});
				Object.freeze(uploads);
				resolve({
					posts: posts,
					uploads: uploads
				});
			}
		});
	});
};
