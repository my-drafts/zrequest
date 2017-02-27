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

const POPTIONS = {
	amount: 1000, // post fields amount: 1000
	encoding: 'utf8', // post fields data encoding: utf8
	size: 2 * 1024 * 1024 // post fields data size: 2mb
};

const UOPTIONS = {
	directory: 'tmp/upload', // post upload directory: tmp/upload
	space: 'Infinity' // post upload space size: Infinity
};

const requestLoad = function (request, size) {
	return new Promise(function (resolve, reject) {
		let body = [],
			bodyLength = 0;
		request.on('error', function (error) {
			reject(error);
		}).on('data', function (chunk) {
			const chunkLength = chunk.length;
			if (size > 0 && (bodyLength + chunkLength) > size) {
				request.connection.destroy();
				reject(new Error('Request body too big'));
			}
			else {
				body.push(chunk);
				bodyLength += chunkLength;
			}
		}).on('end', function () {
			resolve(body);
		});
	});
}

const ZRequestPost = function (zrequest, options) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	const O = Object.assign({}, POPTIONS, UOPTIONS, options);
	const T = zt.al(R.contentTypes, {
		o: R.contentTypes,
		else: {}
	});
	switch (T.mime) {
		case 'multipart/form-data':
			const Ompfd = {
				autoFields: true,
				autoFiles: true,
				encoding: O.encoding || 'utf8',
				maxFieldsSize: O.size,
				maxFields: O.amount,
				maxFilesSize: O.space || 0,
				uploadDir: O.directory || 'tmp/upload'
			};
			return new Promise(function (resolve, reject) {
				const form = new multiparty.Form(Ompfd);
				// multipart/form-data
				form.parse(R.request, function (error, fields, files) {
					if (error) {
						reject(error);
					}
					else {
						const items = Object.keys(files).map(function (fieldName) {
							const fieldFiles = files[fieldName].map(function (file) {
								return new ZUpload(file);
							});
							return {
								[fieldName]: fieldFiles
							};
						});
						const post = object2encoding(fields, O.encoding);
						R.POST = Object.assign(R.POST, post);
						R.UPLOAD = Object.assign.apply(R.UPLOAD, items);
						Object.freeze(R.POST);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
				});
			});
		case 'application/json':
			return new Promise(function (resolve, reject) {
				requestLoad(R.request, O.size).then(function (bodyChunks) {
					const body = Buffer.concat(bodyChunks).toString(O.encoding);
					// application/json
					const data = JSON.parse(body);
					const D = zt.as(data);
					if (O.amount > 0 && D.o && Object.keys(data).length > O.amount) {
						reject(new Error('Request body has too many keys'));
					}
					else if (O.amount > 0 && D.a && data.length > O.amount) {
						reject(new Error('Request body has too many elements'));
					}
					else if (D.o || D.a) {
						R.POST = Object.assign(R.POST, data);
						Object.freeze(R.POST);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
					else {
						Object.freeze(R.POST);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
				}, reject);
			});
		case 'application/x-www-form-urlencoded':
			return new Promise(function (resolve, reject) {
				requestLoad(R.request, O.size).then(function (bodyChunks) {
					const body = Buffer.concat(bodyChunks).toString(O.encoding);
					// application/x-www-form-urlencoded
					const data = qs.parse(body, '&', '=', {
						maxKeys: 0
					});
					const D = zt.as(data);
					if (O.amount > 0 && D.o && Object.keys(data).length > O.amount) {
						reject(new Error('Request body has too many keys'));
					}
					else if (O.amount > 0 && D.a && data.length > O.amount) {
						reject(new Error('Request body has too many elements'));
					}
					else if (D.o || D.a) {
						R.POST = Object.assign(R.POST, data);
						Object.freeze(R.POST);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
					else {
						Object.freeze(R.POST);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
				}, reject);
			});
		case 'text/plain':
			const re = [
				/[\r][\n]/i,
				/^([^\=]+)[\=](.*)$/
			];
			return new Promise(function (resolve, reject) {
				requestLoad(R.request, O.size).then(function (bodyChunks) {
					const body = Buffer.concat(bodyChunks).toString(O.encoding);
					// text/plain
					const data = body.split(re[0]).map(function (d) {
						const dd = re[1].exec(d);
						return !zt.as(dd).empty && !zt.as(dd[1]).empty ? {
							key: dd[1],
							value: dd[2]
						} : false;
					}).filter(function (d) {
						return d;
					}).reduce(function (D, d) {
						D[d.key] = (d.key in D ? D[d.key] : []).concat([d.value]);
						return D;
					}, {});
					if (O.amount > 0 && Object.keys(data).length > O.amount) {
						reject(new Error('Request body has too many elements'));
					}
					else {
						R.POST = Object.assign(R.POST, data);
						Object.freeze(R.POST);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
				}, reject);
			});
		default:
			return Promise.resolve(R);
	}
};

module.exports = ZRequestPost;
