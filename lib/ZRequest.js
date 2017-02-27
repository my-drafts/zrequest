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
 * 	request = request,
 * 	queries = {key: value, ...},
 * 	statusCode = 0,
 * 	statusMessage = '',
 * 	userAgent = {agent: '?', userAgent: ''},
 *
 *  COOKIE = {key: value, ...},
 *  QUERY = {field: data, ...},
 *  POST = {field: data, ...},
 *  UPLOAD = {field: [ZUpload, ], ...},
 *
 *  constructor(request){}
 *  cookie(key, indexInKey)
 *  query(key, indexInKey)
 *  post(key, indexInKey)
 *  upload(key, indexInKey)
 *  uploadClean()
 * }
 *
 * */

const http = require('http');
const uf = require('util').format;
const ui = require('util').inspect;
const zt = require('ztype');

const bindUploadClean = require('./bindUploadClean');

const r2accept = require('./request2accept');
const r2acceptCharset = require('./request2acceptCharset');
const r2acceptEncoding = require('./request2acceptEncoding');
const r2acceptLanguage = require('./request2acceptLanguage');
const r2contentType = require('./request2contentType');
const r2cookie = require('./request2cookie');
const r2headers = require('./request2headers');
const r2host = require('./request2host');
const r2httpVersion = require('./request2httpVersion');
const r2method = require('./request2method');
const r2path = require('./request2path');
const r2port = require('./request2port');
const r2queries = require('./request2queries');
const r2statusCode = require('./request2statusCode');
const r2statusMessage = require('./request2statusMessage');
const r2userAgent = require('./request2userAgent');

const ZRequestCookie = require('./ZRequestCookie');
const ZRequestQuery = require('./ZRequestQuery');
const ZRequestPost = require('./ZRequestPost');

const re = [
	/^(.*[\/])([^\/]*)$/i,
	/^[\/](.*?)[\/]?$/i
];

const bind = function (zrequest, property, call, freeze) {
	const R = zt.al(zrequest, {
		o: zrequest,
		else: {}
	});
	R[call] = function (key, index) {
		return object2keyIndex(R[property], key, index, true);
	};
	if (freeze) {
		Object.freeze(R[call]);
	}
};

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

	get h() {
		return this.host;
	}

	get hh() {
		return this.headers;
	}

	get f() {
		return this.file;
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

	get p() {
		return this.path;
	}

	get pp() {
		return this.paths;
	}

	get r() {
		return this.request;
	}

	get acceptTypes() {
		if (this._acceptList === false) {
			this._acceptList = r2accept(this.request, '*');
			Object.freeze(this._acceptList);
		}
		return this._acceptList;
	}

	get acceptCharsets() {
		if (this._acceptCharsetList === false) {
			this._acceptCharsetList = r2acceptCharset(this.request, '*');
			Object.freeze(this._acceptCharsetList);
		}
		return this._acceptCharsetList;
	}

	get acceptEncodings() {
		if (this._acceptEncodingList === false) {
			this._acceptEncodingList = r2acceptEncoding(this.request, '*');
			Object.freeze(this._acceptEncodingList);
		}
		return this._acceptEncodingList;
	}

	get acceptLanguages() {
		if (this._acceptLanguageList === false) {
			this._acceptLanguageList = r2acceptLanguage(this.request, '*');
			Object.freeze(this._acceptLanguageList);
		}
		return this._acceptLanguageList;
	}

	get contentTypes() {
		if (this._contentTypeList === false) {
			this._contentTypeList = r2contentType(this.request, '-/-');
			Object.freeze(this._contentTypeList);
		}
		return this._contentTypeList;
	}

	get cookies() {
		if (this._cookieList === false) {
			this._cookieList = r2cookie(this.request, '');
			Object.freeze(this._cookieList);
		}
		return this._cookieList;
	}

	get directory() {
		if (this._directoryString === false) {
			this._directoryString = this.path.replace(re[0], '$1');
			Object.freeze(this._directoryString);
		}
		return this._directoryString;
	}

	get headers() {
		if (this._headerList === false) {
			this._headerList = r2headers(this.request, {});
			Object.freeze(this._headerList);
		}
		return this._headerList;
	}

	get host() {
		if (this._hostString === false) {
			this._hostString = r2host(this.request, '*');
			Object.freeze(this._hostString);
		}
		return this._hostString;
	}

	get httpVersion() {
		if (this._httpVersionString === false) {
			this._httpVersionString = r2httpVersion(this.request, '?');
			Object.freeze(this._httpVersionString);
		}
		return this._httpVersionString;
	}

	get file() {
		if (this._fileString === false) {
			this._fileString = this.path.replace(re[0], '$2');
			Object.freeze(this._fileString);
		}
		return this._fileString;
	}

	get method() {
		if (this._methodString === false) {
			this._methodString = r2method(this.request, '*');
			Object.freeze(this._methodString);
		}
		return this._methodString;
	}

	get path() {
		if (this._pathString === false) {
			this._pathString = r2path(this.request, '/');
			Object.freeze(this._pathString);
		}
		return this._pathString;
	}

	get paths() {
		if (this._pathList === false) {
			this._pathList = this.path.replace(re[1], '$1').split('/');
			Object.freeze(this._pathList);
		}
		return this._pathList;
	}

	get port() {
		if (this._portNumber === false) {
			this._portNumber = r2port(this.request, 0);
			Object.freeze(this._portNumber);
		}
		return this._portNumber;
	}

	get request() {
		return this._request;
	}

	get queries() {
		if (this._queriesList === false) {
			this._queriesList = r2queries(this.request, {});
			Object.freeze(this._queriesList);
		}
		return this._queriesList;
	}

	get statusCode() {
		if (this._statusCodeNumber === false) {
			this._statusCodeNumber = r2statusCode(this.request, 0);
			Object.freeze(this._statusCodeNumber);
		}
		return this._statusCodeNumber;
	}

	get statusMessage() {
		if (this._statusMessageString === false) {
			this._statusMessageString = r2statusMessage(this.request, '');
			Object.freeze(this._statusMessageString);
		}
		return this._statusMessageString;
	}

	get userAgent() {
		if (this._userAgentObject === false) {
			this._userAgentObject = r2userAgent(this.request, '');
			Object.freeze(this._userAgentObject);
		}
		return this._userAgentObject;
	}

	constructor(request) {
		if (zt.as(request).has('IncomingMessage')) {
			this._acceptList = false;
			this._acceptCharsetList = false;
			this._acceptEncodingList = false;
			this._acceptLanguageList = false;
			this._contentTypeList = false;
			this._cookieList = false;
			this._directoryString = false;
			this._fileString = false;
			this._headerList = false;
			this._hostString = false;
			this._httpVersionString = false;
			this._methodString = false;
			this._pathList = false;
			this._pathString = false;
			this._portNumber = false;
			this._request = request;
			this._queriesList = false;
			this._statusCodeNumber = false;
			this._statusMessageString = false;
			this._userAgentObject = false;
			this.COOKIE = {};
			this.QUERY = {};
			this.POST = {};
			this.UPLOAD = {};
			bind(this, 'COOKIE', 'cookie', false);
			bind(this, 'QUERY', 'query', false);
			bind(this, 'POST', 'post', false);
			bind(this, 'UPLOAD', 'upload', false);
			bindUploadClean(this, 'UPLOAD');
		}
		else {
			throw 'wrong request';
		}
	}

	final(options) {
		const O = zt.al(options, {
			o: options,
			else: {}
		});
		const R = this;
		return Promise.resolve()
			.then(function () {
				return R.uploadClean(O.postAndUploadFinal);
			})
			.then(function () {
				return R;
			});
	}

	init(options) {
		const O = zt.al(options, {
			o: options,
			else: {}
		});
		const R = this;
		return Promise.resolve()
			.then(function () {
				return ZRequestCookie(R, O.cookieInit);
			})
			.then(function () {
				return ZRequestQuery(R, O.queryInit);
			})
			.then(function () {
				const o = O.postAndUploadInitMethods;
				if (zt.as(o).a && o.length > 0) {
					const m = new RegExp(uf('^%s$', o.join('|')), 'i');
					if (m.test(R.method)) {
						return ZRequestPost(R, O.postAndUploadInit);
					}
					else {
						return Promise.resolve();
					}
				}
				else {
					return Promise.resolve();
				}
			})
			.then(function () {
				return R;
			});
	}

	toString() {
		const state = {
			accept: this.acceptTypes,
			acceptCharsets: this.acceptCharsets,
			acceptEncodings: this.acceptEncodings,
			acceptLanguages: this.acceptLanguages,
			contentTypes: this.contentTypes,
			cookies: this.cookies,
			directory: this.directory,
			headers: this.headers,
			host: this.host,
			httpVersion: this.httpVersion,
			file: this.file,
			method: this.method,
			path: this.path,
			paths: this.paths,
			port: this.port,
			//request: this.request,
			queries: this.queries,
			statusCode: this.statusCode,
			statusMessage: this.statusMessage,
			userAgent: this.userAgent,
			COOKIE: this.COOKIE,
			QUERY: this.QUERY,
			POST: this.POST,
			UPLOAD: this.UPLOAD
		}
		return ui(state, {
			breakLength: 80,
			colors: false,
			depth: 5,
			showHidden: false
		});
	}
}

module.exports = ZRequest;
