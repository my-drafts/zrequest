#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *  c -> statusCode
 *  cc -> cookies
 *  code -> statusCode
 *  d -> directory
 *  dir -> directory
 *  h -> host
 *  hh -> headers
 *  f -> file
 *  m -> method
 *  message -> statusMessage
 *  n -> port
 *  number -> port
 *  p -> path
 *  pp -> paths
 *  r -> request
 *
 *  COOKIE -> cookies,
 *  POST -> posts,
 *  QUERY -> queries,
 *  UPLOAD -> uploads,
 *
 *  acceptTypes: [{mime: '*', q: 1, subtype: '', type: '*'}, ...],
 *  acceptCharsets: [{charset: '*', q: 1}, ...],
 *  acceptEncodings: [{encoding: '*', q: 1}, ...],
 *  acceptLanguages: [{language: '*', local: '*', location: '*', q: 1}, ...],
 *  contentTypes: {mime: '-/-', subtype: '-', type: '-', key: value, ...},
 *  cookies: {key: value, ...},
 *  directory: '/',
 *  headers: {key: value, ...},
 *  host: '*',
 *  httpVersion: '?',
 *  file: '',
 *  method: '*',
 *  options: {...},
 *  path: '/',
 *  paths: ['directory1', 'directory2', ..., 'file'],
 *  port: 0,
 *  posts: {field: [data, ...], ...},
 *  request: request,
 *  queries: {field: [data, ...], ...},
 *  statusCode: 0,
 *  statusMessage: '',
 *  uploads: {field: [ZUpload, ...], ...},
 *  userAgent: {agent: '?', userAgent: ''},
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
const uf = require('util').format;
const ui = require('util').inspect;
const zt = require('ztype');

const cookiesLoader = require('./cookiesLoader');

const postsLoader = require('./postsLoader');
const _postsLoaders = [
	'application-json',
	'application-x-www-form-urlencoded',
	'multipart-form-data',
	'text-plain'
].map(function (item) {
	return {
		[item]: require(uf('./postsLoader/%s', item))
	};
});
const postsLoaders = Object.assign.apply({}, _postsLoaders);

const queriesLoader = require('./queriesLoader');

const _request2data = [
	'accept',
  'acceptCharset',
  'acceptEncoding',
  'acceptLanguage',
  'contentType',
  'cookies',
  'directory',
  'file',
  'headers',
  'host',
  'httpVersion',
  'method',
  'path',
  'paths',
  'port',
  'posts',
  'queries',
  'statusCode',
  'statusMessage',
  'uploads',
  'userAgent'
].map(function (item) {
	return {
		[item]: require(uf('./request2data/%s', item))
	};
});
const request2data = Object.assign.apply({}, _request2data);

const OPTIONS = {
	cookiesAmount: 0, // cookie fields amount: 0 - no limit
	cookiesEnable: true,
	cookiesEncoding: 'utf8', // cookie fields data encoding: utf8
	cookiesSize: 0, // cookie fields data summery size: 0 - no limit
	cookiesSkipEmpty: true,
	postMethods: ["post", "put"], // post load methods
	postsAmount: 0, // post fields amount: 0 - no limit
	postsEnable: true,
	postsEncoding: 'utf8', // post fields data encoding: utf8
	postsSize: 0, // post fields data size: 0 - no limit
	postsSkipEmpty: true,
	queriesAmount: 0, // query fields amount: 0 - no limit
	queriesEnable: true,
	queriesEncoding: 'utf8', // query fields data encoding: utf8
	queriesSize: 0, // query fields data summery size: 0 - no limit
	queriesSkipEmpty: true,
	uploadsDirectory: 'tmp/upload', // post upload directory: tmp/upload
	uploadsSkipEmpty: true,
	uploadsSpace: 'Infinity' // post upload space size: Infinity
};

const r2d = function (zrequest, zproperty, key, freeze) {
	if (zrequest[zproperty] === false) {
		if (key in request2data) {
			zrequest[zproperty] = request2data[key](zrequest);
		}
		else {
			zrequest[zproperty] = undefined;
		}
		if (freeze) {
			Object.freeze(zrequest[zproperty]);
		}
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
		return zt.ab(index, {
			n: o2v,
			else: _default
		});
	};
	const object2key = function (object) {
		// return all with out index as array
		const _defualt = flagA === false ? object[key] : [object[key]]; // object[key];
		return zt.ab(object[key], {
			a: object2index,
			else: _defualt
		});
	};
	return zt.ab(object, {
		o: object2key,
		else: undefined
	});
};

class ZRequest {
	get c() {
		return this.statusCode;
	};

	get cc() {
		return this.cookies;
	};

	get code() {
		return this.statusCode;
	};

	get d() {
		return this.directory;
	};

	get dir() {
		return this.directory;
	};

	get f() {
		return this.file;
	};

	get h() {
		return this.host;
	};

	get hh() {
		return this.headers;
	};

	get m() {
		return this.method;
	};

	get message() {
		return this.statusMessage;
	};

	get n() {
		return this.port;
	};

	get number() {
		return this.port;
	};

	get o() {
		return this.options;
	};

	get p() {
		return this.path;
	};

	get pp() {
		return this.paths;
	};

	get r() {
		return this.request;
	};

	get COOKIE() {
		return this.cookies;
	};

	get QUERY() {
		return this.queries;
	};

	get POST() {
		return this.posts;
	};

	get UPLOAD() {
		return this.uploads;
	};

	get acceptTypes() {
		return r2d(this, '_acceptList', 'accept', true);
	};

	get acceptCharsets() {
		return r2d(this, '_acceptCharsetList', 'acceptCharset', true);
	};

	get acceptEncodings() {
		return r2d(this, '_acceptEncodingList', 'acceptEncoding', true);
	};

	get acceptLanguages() {
		return r2d(this, '_acceptLanguageList', 'acceptLanguage', true);
	};

	get contentTypes() {
		return r2d(this, '_contentTypeList', 'contentType', true);
	};

	get cookies() {
		return r2d(this, '_cookiesList', 'cookies', false);
	};

	get directory() {
		return r2d(this, '_directoryString', 'directory', true);
	};

	get file() {
		return r2d(this, '_fileString', 'file', true);
	};

	get headers() {
		return r2d(this, '_headerList', 'headers', true);
	};

	get host() {
		return r2d(this, '_hostString', 'host', true);
	};

	get httpVersion() {
		return r2d(this, '_httpVersionString', 'httpVersion', true);
	};

	get method() {
		return r2d(this, '_methodString', 'method', true);
	};

	get options() {
		return this._options;
	};

	get path() {
		return r2d(this, '_pathString', 'path', true);
	};

	get paths() {
		return r2d(this, '_pathsList', 'paths', true);
	};

	get port() {
		return r2d(this, '_portNumber', 'port', true);
	};

	get posts() {
		return r2d(this, '_postsList', 'posts', false);
	};

	get request() {
		return this._request;
	};

	get queries() {
		return r2d(this, '_queriesList', 'queries', false);
	};

	get statusCode() {
		return r2d(this, '_statusCodeNumber', 'statusCode', true);
	};

	get statusMessage() {
		return r2d(this, '_statusMessageString', 'statusMessage', true);
	};

	get uploads() {
		return r2d(this, '_uploadsList', 'uploads', false);
	};

	get userAgent() {
		return r2d(this, '_userAgentObject', 'userAgent', true);
	};

	constructor(request, options) {
		if (request instanceof http.IncomingMessage) {
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
			throw new Error('ZRequest.constructor wrong request');
		}
	};

	cookie(key, index) {
		return o2ki(this.cookies, key, index, true);
	};

	cookieLoad(options) {
		return this.loadCookies(options);
	}

	final() {
		return this.unupload();
	};

	inspect() {
		return {
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
			options: this.options,
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
		};
	};

	load(options) {
		const Z = this;
		return Promise.resolve()
			.then(function () {
				return Z.loadCookies(options);
			})
			.then(function () {
				return Z.loadQueries(options);
			})
			.then(function () {
				return Z.loadPosts(options);
			});
	};

	loadCookies(options) {
		const Z = this;
		const O = Object.assign({}, Z.options, options);
		return cookiesLoader(Z, O)
			.then(function (cookies) {
				Z._cookiesList = cookies;
			});
	};

	loadPosts(options) {
		const Z = this;
		const O = Object.assign({}, Z.options, options);
		const type = Z.contentTypes.mime.replace('/', '-');
		const methods = [].concat(O.postMethods);
		if (methods.indexOf(Z.method) < 0) {
			return Promise.resolve();
		}
		else {
			const loader = type in postsLoaders ? postsLoaders[type] : postsLoader;
			return loader(Z, O).then(function (pu) {
				if ('posts' in pu) {
					Z._postsList = Object.assign(Z.posts, pu.posts);
				}
				if ('uploads' in pu) {
					Z._uploadsList = Object.assign(Z.uploads, pu.uploads);
				}
			});
		}
	};

	loadQueries(options) {
		const Z = this;
		const O = Object.assign({}, Z.options, options);
		return queriesLoader(Z, O)
			.then(function (queries) {
				Z._queriesList = queries;
			});
	};

	post(key, index) {
		return o2ki(this.posts, key, index, true);
	};

	postLoad(options) {
		return loadPosts(options);
	}

	query(key, index) {
		return o2ki(this.queries, key, index, true);
	};

	queryLoad(options) {
		return loadQueries(options);
	}

	toString() {
		return ui(this, {
			breakLength: 80,
			colors: false,
			depth: 5,
			showHidden: false
		});
	};

	unupload() {
		const Z = this;
		return Promise.all(Object.keys(Z.uploads)
			.reduce(function (all, field) {
				return all.concat(Z.uploads[field]);
			}, [])
			.map(function (upload) {
				return upload.remove();
			}));
	};

	upload(key, index) {
		return o2ki(this.uploads, key, index, true);
	};
}

module.exports = ZRequest;
