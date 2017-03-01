#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *   POST = {field: [value, ...], ...},
 *   UPLOAD = {field: [ZUpload, ...], ...},
 * }
 *
 * */

const multiparty = require('multiparty');
const qs = require('querystring');
const zt = require('ztype');

const object2encoding = require('./object2encoding');
const ZUpload = require('./ZUpload');

module.exports = function (zrequest, options) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	const O = zt.al(options, {
		o: options,
		else: {}
	});

	const Ompfd = {
		autoFields: true,
		autoFiles: true,
		encoding: O.postsEncoding,
		maxFieldsSize: O.postsSize,
		maxFields: O.postsAmount,
		maxFilesSize: O.uploadsSpace,
		uploadDir: O.uploadsDirectory
	};
	return new Promise(function (resolve, reject) {
		const form = new multiparty.Form(Ompfd);
		// multipart/form-data
		form.parse(R.request, function (error, fields, files) {
			if (error) {
				reject(error);
			}
			else {
        // TODO: uploads to object of arrays
				const items = Object.keys(files).map(function (fieldName) {
					const fieldFiles = files[fieldName].map(function (file) {
						return new ZUpload(file);
					});
					return {
						[fieldName]: fieldFiles
					};
				});
        // TODO: posts to object of arrays
				const post = object2encoding(fields, O.encoding);
        // TODO: return object with posts and uploads fields
				R.POST = Object.assign(R.POST, post);
				R.UPLOAD = Object.assign.apply(R.UPLOAD, items);
				Object.freeze(R.POST);
				Object.freeze(R.UPLOAD);
				resolve(R);
			}
		});
	});

};

module.exports = ZRequestPost;
