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
			// multipart/form-data
			return new Promise(function (resolve, reject) {
				const form = new multiparty.Form(Ompfd);
				form.parse(R.request, function (error, fields, files) {
					if (!error) {
						const items = Object.keys(files).map(function (fieldName) {
							const fieldFiles = files[fieldName].map(function (file) {
								return new ZUpload(file);
							});
							return {
								[fieldName]: fieldFiles
							};
						});
						R.POST = Object.assign(R.POST, object2encoding(fields, O.encoding));
						Object.freeze(R.POST);
						R.UPLOAD = Object.assign.apply(R.UPLOAD, items);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
					else {
						reject(error);
					}
				});
			});
		case 'application/json':
			// application/json
			return new Promise(function (resolve, reject) {
				R.request.on('error', function (error) {
					reject(error);
				});
				let body = new Buffer('', 'utf8');
				R.request.on('data', function (chunk) {
					if (O.size > 0 && (body.length + chunk.length) > O.size) {
						R.request.connection.destroy();
						reject(new Error('Request body too big'));
					}
					else {
						body += chunk;
					}
				});
				R.request.on('end', function () {
					const edata = body.toString(O.encoding);
					const data = JSON.parse(edata);
					const D = zt.as(data);
					if (O.amount > 0 && D.o && Object.keys(data).length > O.amount) {
						reject(new Error('Request body has too many keys'));
					}
					else if (O.amount > 0 && D.a && data.length > O.amount) {
						reject(new Error('Request body has too many elements'));
					}
					else {
						if (D.o) {
							R.POST = Object.assign(R.POST, object2encoding(data, O.encoding));
						}
						else if (D.a) {
							R.POST = Object.assign(R.UPLOAD, object2encoding(data, O.encoding));
						}
						Object.freeze(R.POST);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
				});
			});
		case 'application/x-www-form-urlencoded':
			// application/x-www-form-urlencoded
			return new Promise(function (resolve, reject) {
				R.request.on('error', function (error) {
					reject(error);
				});
				let body = new Buffer('');
				R.request.on('data', function (chunk) {
					if (O.size > 0 && (body.length + chunk.length) > O.size) {
						R.request.connection.destroy();
						reject(new Error('Request body too big'));
					}
					else {
						body += chunk;
					}
				});
				R.request.on('end', function () {
					const edata = body.toString(O.encoding);
					const data = qs.parse(edata, '&', '=', {
						maxKeys: 0
					});
					const D = zt.as(data);
					if (O.amount > 0 && D.o && Object.keys(data).length > O.amount) {
						reject(new Error('Request body has too many keys'));
					}
					else if (O.amount > 0 && D.a && data.length > O.amount) {
						reject(new Error('Request body has too many elements'));
					}
					else {
						if (D.o) {
							R.POST = Object.assign(R.POST, object2encoding(data, O.encoding));
						}
						else if (D.a) {
							R.POST = Object.assign(R.POST, object2encoding(data, O.encoding));
						}
						Object.freeze(R.POST);
						Object.freeze(R.UPLOAD);
						resolve(R);
					}
				});
			});
		case 'text/plain':
			const re = [
				/[\r][\n]/i,
				/^([^\=]*)[\=](.*)$/
			];
			// text/plain
			return new Promise(function (resolve, reject) {
				R.request.on('error', function (error) {
					reject(error);
				});
				let body = new Buffer('');
				R.request.on('data', function (chunk) {
					if (O.size > 0 && (body.length + chunk.length) > O.size) {
						R.request.connection.destroy();
						reject(new Error('Request body too big'));
					}
					else {
						body += chunk;
					}
				});
				R.request.on('end', function () {
					const edata = body.toString(O.encoding);
					const adata = edata.split(re[0]).map(function (d) {
						const dd = re[1].exec(d);
						return dd ? {
							key: dd[1],
							value: dd[2]
						} : false;
					}).filter(function (d) {
						return d;
					});
					const data = adata.reduce(function (D, d) {
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
				});
			});
		default:
			return Promise.resolve(R);
	}
};

module.exports = ZRequestPost;
