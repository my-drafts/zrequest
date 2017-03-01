#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *  c = statusCode
 *  cc = cookies
 *  code = statusCode
 *  d = directory
 *  dir = directory
 *  h = host
 *  hh = headers
 *  f = file
 *  m = method
 *  message = statusMessage
 *  n = port
 *  number = port
 *  p = path
 *  pp = paths
 *  r = request
 *
 *  COOKIE = cookies,
 *  POST = posts,
 *  QUERY = queries,
 *  UPLOAD = uploads,
 *
 *  acceptTypes = [{mime: '*', q: 1, subtype: '', type: '*'}, ...],
 *  acceptCharsets = [{charset: '*', q: 1}, ...],
 * 	acceptEncodings = [{encoding: '*', q: 1}, ...],
 * 	acceptLanguages = [{language: '*', local: '*', location: '*', q: 1}, ...],
 *  contentTypes = {mime: '-/-', subtype: '-', type: '-', key: value, ...},
 * 	cookies = {key: value, ...},
 * 	directory = '/',
 * 	headers = {key: value, ...},
 * 	host = '*',
 * 	httpVersion = '?',
 * 	file = '',
 * 	method = '*',
 * 	path = '/',
 * 	paths = ['directory1', 'directory2', ..., 'file'],
 * 	port = 0,
 * 	posts = {field: [data, ...], ...},
 * 	request = request,
 * 	queries = {field: [data, ...], ...},
 * 	statusCode = 0,
 * 	statusMessage = '',
 * 	uploads = {field: [ZUpload, ...], ...},
 * 	userAgent = {agent: '?', userAgent: ''},
 *
 *  constructor(request){}
 *
 *  cookie(key, indexInKey)
 *  post(key, indexInKey)
 *  query(key, indexInKey)
 *  unuploads()
 *  upload(key, indexInKey)
 * }
 *
 * */

const http = require('http');
const fs = require('fs');
const uf = require('util').format;
const ui = require('util').inspect;
const zt = require('ztype');

const postLoader = fs
	.readdirSync(uf('%s/postLoader', __dirname))
	.reduce(function (L, file) {
		const re = /^([\w\-]+)[\.]js$/i;
		if (re.test(file)) {
			const mime = file.replace(re, '$1');
			const path = uf('./postLoader/%s', file);
			L[mime] = require(path);
		}
		return L;
	}, {});

const request2data = fs
	.readdirSync(uf('%s/request2data', __dirname))
	.reduce(function (D, file) {
		const re = /^([\w]+)[\.]js$/i;
		if (re.test(file)) {
			const key = file.replace(re, '$1');
			const path = uf('./request2data/%s', file);
			D[key] = require(path);
		}
		return D;
	}, {});

const OPTIONS = {
	cookiesAmount: 100, // cookie fields amount: 100; no limit: 0
	cookiesSize: 8 * 1024, // cookie fields data summery size: 8kb; no limit: 0
	postMethods: ["post", "put"], // post load methods
	postsAmount: 1000, // post fields amount: 1000; no limit: 0
	postsEncoding: 'utf8', // post fields data encoding: utf8
	postsSize: 2 * 1024 * 1024, // post fields data size: 2mb; no limit: 0
	queriesAmount: 100, // query fields amount: 100; no limit: 0
	queriesSize: 8 * 1024, // query fields data summery size: 8kb; no limit: 0
	uploadsDirectory: 'tmp/upload', // post upload directory: tmp/upload
	uploadsSpace: 'Infinity' // post upload space size: Infinity
};

const r2d = function (zrequest, zproperty, key) {
	if (zrequest[zproperty] !== false);
	else if (key in request2data) {
		zrequest[zproperty] = request2data[key](zrequest.request);
		Object.freeze(zrequest[zproperty]);
	}
	else {
		zrequest[zproperty] = undefined;
		Object.freeze(zrequest[zproperty]);
	}
	return zrequest[zproperty];
};

const o2ki = function (object, key, index, flagA) {
	const object2value = function (array, index) {
		return array[(index % array.length + array.length) % array.length];
	};
	const object2index = function (object) {
		// return all with out index as array
		const _default = flagA === false ? object : [object]; // object
		const o2v = function (index) {
			return object2value(object, index);
		};
		return zt.al(index, {
			n: o2v,
			else: _default
		});
	};
	const object2key = function (object) {
		// return all with out index as array
		const _defualt = flagA === false ? object[key] : [object[key]]; // object[key];
		return zt.al(object[key], {
			a: object2index,
			else: _defualt
		});
	};
	return zt.al(object, {
		o: object2key,
		else: undefined
	});
};

const o2sa = function (object, name, size, amount) {
	if (size > 0 && JSON.stringify(object).length > size) {
		throw new Error(uf('%s too big', name));
	}
	else if (amount > 0 && Object.keys(object).length > amount) {
		throw new Error(uf('%s has too many keys', name));
	}
	return true;
};

const ZRequestPost = require('./ZRequestPost');

class ZRequest {
	get c() {
		return this.statusCode;
	}

	get cc() {
		return this.cookies;
	}

	get code() {
		return this.statusCode;
	}

	get d() {
		return this.directory;
	}

	get dir() {
		return this.directory;
	}

	get f() {
		return this.file;
	}

	get h() {
		return this.host;
	}

	get hh() {
		return this.headers;
	}

	get m() {
		return this.method;
	}

	get message() {
		return this.statusMessage;
	}

	get n() {
		return this.port;
	}

	get number() {
		return this.port;
	}

	get o() {
		return this.options;
	}

	get p() {
		return this.path;
	}

	get pp() {
		return this.paths;
	}

	get r() {
		return this.request;
	}

	get COOKIE() {
		return this.cookies;
	}

	get QUERY() {
		return this.queries;
	}

	get POST() {
		return this.posts;
	}

	get UPLOAD() {
		return this.uploads;
	}

	get acceptTypes() {
		return r2d(this, '_acceptList', 'accept');
	}

	get acceptCharsets() {
		return r2d(this, '_acceptCharsetList', 'acceptCharset');
	}

	get acceptEncodings() {
		return r2d(this, '_acceptEncodingList', 'acceptEncoding');
	}

	get acceptLanguages() {
		return r2d(this, '_acceptLanguageList', 'acceptLanguage');
	}

	get contentTypes() {
		return r2d(this, '_contentTypeList', 'contentType');
	}

	get cookies() {
		return r2d(this, '_cookiesList', 'cookies');
	}

	get directory() {
		return r2d(this, '_directoryString', 'directory');
	}

	get file() {
		return r2d(this, '_fileString', 'file');
	}

	get headers() {
		return r2d(this, '_headerList', 'headers');
	}

	get host() {
		return r2d(this, '_hostString', 'host');
	}

	get httpVersion() {
		return r2d(this, '_httpVersionString', 'httpVersion');
	}

	get method() {
		return r2d(this, '_methodString', 'method');
	}

	get options() {
		return this._options;
	}

	get path() {
		return r2d(this, '_pathString', 'path');
	}

	get paths() {
		return r2d(this, '_pathsList', 'paths');
	}

	get port() {
		return r2d(this, '_portNumber', 'port');
	}

	get posts() {
		return r2d(this, '_postsList', 'posts');
	}

	get request() {
		return this._request;
	}

	get queries() {
		return r2d(this, '_queriesList', 'queries');
	}

	get statusCode() {
		return r2d(this, '_statusCodeNumber', 'statusCode');
	}

	get statusMessage() {
		return r2d(this, '_statusMessageString', 'statusMessage');
	}

	get uploads() {
		return r2d(this, '_uploadsList', 'uploads');
	}

	get userAgent() {
		return r2d(this, '_userAgentObject', 'userAgent');
	}

	constructor(request, options) {
		if (zt.as(request).has('IncomingMessage')) {
			this._acceptList = false;
			this._acceptCharsetList = false;
			this._acceptEncodingList = false;
			this._acceptLanguageList = false;
			this._contentTypeList = false;
			this._cookiesList = false;
			this._directoryString = false;
			this._fileString = false;
			this._headerList = false;
			this._hostString = false;
			this._httpVersionString = false;
			this._methodString = false;
			this._pathString = false;
			this._pathsList = false;
			this._portNumber = false;
			this._postsList = false;
			this._request = request;
			this._queriesList = false;
			this._statusCodeNumber = false;
			this._statusMessageString = false;
			this._uploadsList = false;
			this._userAgentObject = false;
			this._options = Object.assign({}, OPTIONS, options);
		}
		else {
			throw 'wrong request';
		}
	}

	cookie(key, index) {
		return o2ki(this.cookies, key, index, true);
	};

	final() {
		const R = this;
		return R.unupload();
	}

	load(options) {
		const R = this;
		const O = Object.assign({}, R.options, options);
		return new Promise(function (resolve, reject) {
			o2sa(R.cookies, 'Cookies', O.cookiesSize, O.cookiesAmount);
			o2sa(R.queries, 'Queries', O.queriesSize, O.queriesAmount);
			const type = R.contentTypes.mime.replace('/', '-');
			const methods = zt.as(O.postMethods).a ? O.postMethods : [O.postMethods];
			if (methods.indexOf(R.method) >= 0 && type in postLoader) {
				postLoader[type](R, O).then(function (postAndUpload) {
					if (posts in postAndUpload){
						const p = '_postsList';
						R[p] = Object.assign(R[p], postAndUpload.posts);
					}
					if (uploads in postAndUpload){
						const u = '_uploadsList';
						R[u] = Object.assign(R[u], postAndUpload.uploads);
					}
					resolve();
				}, reject);
			}
			else {
				resolve()
			}
		});
	}

	post(key, index) {
		return o2ki(this.posts, key, index, true);
	};

	query(key, index) {
		return o2ki(this.queries, key, index, true);
	};

	toString() {
		const state = {
			accept: this.acceptTypes,
			acceptCharsets: this.acceptCharsets,
			acceptEncodings: this.acceptEncodings,
			acceptLanguages: this.acceptLanguages,
			contentTypes: this.contentTypes,
			cookies: this.cookies,
			directory: this.directory,
			file: this.file,
			headers: this.headers,
			host: this.host,
			httpVersion: this.httpVersion,
			method: this.method,
			path: this.path,
			paths: this.paths,
			port: this.port,
			posts: this.posts,
			//request: this.request,
			queries: this.queries,
			statusCode: this.statusCode,
			statusMessage: this.statusMessage,
			uploads: this.uploads,
			userAgent: this.userAgent
		}
		return ui(state, {
			breakLength: 80,
			colors: false,
			depth: 5,
			showHidden: false
		});
	}

	unupload() {
		return Promise.all(Object.keys(this.uploads)
			.reduce(function (all, field) {
				return all.concat(this.uploads[field]);
			}, [])
			.map(function (file) {
				return file.remove();
			}));
	};

	upload(key, index) {
		return o2ki(this.uploads, key, index, true);
	};
}

module.exports = ZRequest;
