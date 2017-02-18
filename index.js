#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
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
 * 	query = {key: value, ...},
 * 	statusCode = 0,
 * 	statusMessage = '',
 * 	userAgent = {agent: '?', userAgent: ''},
 *  constructor(request){}
 * }
 *
 * */

const zt = require('ztype');

const r2accept = require('./lib/request2accept');
const r2acceptCharset = require('./lib/request2acceptCharset');
const r2acceptEncoding = require('./lib/request2acceptEncoding');
const r2acceptLanguage = require('./lib/request2acceptLanguage');
const r2contentType = require('./lib/request2contentType');
const r2cookie = require('./lib/request2cookie');
const r2headers = require('./lib/request2headers');
const r2host = require('./lib/request2host');
const r2httpVersion = require('./lib/request2httpVersion');
const r2method = require('./lib/request2method');
const r2path = require('./lib/request2path');
const r2port = require('./lib/request2port');
const r2query = require('./lib/request2query');
const r2statusCode = require('./lib/request2statusCode');
const r2statusMessage = require('./lib/request2statusMessage');
const r2userAgent = require('./lib/request2userAgent');

const re = [
	/^(.*[\/])([^\/]*)$/i,
	/^[\/](.*?)[\/]?$/i
];

class ZRequest{
	get acceptTypes(){
		if(this._acceptList === false){
			this._acceptList = r2accept(this.request, '*');
			Object.freeze(this._acceptList);
		}
		return this._acceptList;
	}

	get acceptCharsets(){
		if(this._acceptCharsetList === false){
			this._acceptCharsetList = r2acceptCharset(this.request, '*');
			Object.freeze(this._acceptCharsetList);
		}
		return this._acceptCharsetList;
	}

	get acceptEncodings(){
		if(this._acceptEncodingList === false){
			this._acceptEncodingList = r2acceptEncoding(this.request, '*');
			Object.freeze(this._acceptEncodingList);
		}
		return this._acceptEncodingList;
	}

	get acceptLanguages(){
		if(this._acceptLanguageList === false){
			this._acceptLanguageList = r2acceptLanguage(this.request, '*');
			Object.freeze(this._acceptLanguageList);
		}
		return this._acceptLanguageList;
	}

	get contentTypes(){
		if(this._contentTypeList === false){
			this._contentTypeList = r2contentType(this.request, '-/-');
			Object.freeze(this._contentTypeList);
		}
		return this._contentTypeList;
	}

	get cookies(){
		if(this._cookieList === false){
			this._cookieList = r2cookie(this.request, '');
			Object.freeze(this._cookieList);
		}
		return this._cookieList;
	}

	get directory(){
		if(this._directoryString === false){
			this._directoryString = this.path.replace(re[0], '$1');
			Object.freeze(this._directoryString);
		}
		return this._directoryString;
	}

	get headers(){
		if(this._headerList === false){
			this._headerList = r2headers(this.request, {});
			Object.freeze(this._headerList);
		}
		return this._headerList;
	}

	get host(){
		if(this._hostString === false){
			this._hostString = r2host(this.request, '*');
			Object.freeze(this._hostString);
		}
		return this._hostString;
	}

	get httpVersion(){
		if(this._httpVersionString === false){
			this._httpVersionString = r2httpVersion(this.request, '?');
			Object.freeze(this._httpVersionString);
		}
		return this._httpVersionString;
	}

	get file(){
		if(this._fileString === false){
			this._fileString = this.path.replace(re[0], '$2');
			Object.freeze(this._fileString);
		}
		return this._fileString;
	}

	get method(){
		if(this._methodString === false){
			this._methodString = r2method(this.request, '*');
			Object.freeze(this._methodString);
		}
		return this._methodString;
	}

	get path(){
		if(this._pathString === false){
			this._pathString = r2path(this.request, '/');
			Object.freeze(this._pathString);
		}
		return this._pathString;
	}

	get paths(){
		if(this._pathList === false){
			this._pathList = this.path.replace(re[1], '$1').split('/');
			Object.freeze(this._pathList);
		}
		return this._pathList;
	}

	get port(){
		if(this._portNumber === false){
			this._portNumber = r2port(this.request, 0);
			Object.freeze(this._portNumber);
		}
		return this._portNumber;
	}

	get request() {
		return this._request;
	}

	get query(){
		if(this._queryList === false){
			this._queryList = r2query(this.request, {});
			Object.freeze(this._queryList);
		}
		return this._queryList;
	}

	get statusCode() {
		if(this._statusCodeNumber === false){
			this._statusCodeNumber = r2statusCode(this.request, 0);
			Object.freeze(this._statusCodeNumber);
		}
		return this._statusCodeNumber;
	}

	get statusMessage() {
		if(this._statusMessageString === false){
			this._statusMessageString = r2statusMessage(this.request, '');
			Object.freeze(this._statusMessageString);
		}
		return this._statusMessageString;
	}

	get userAgent() {
		if(this._userAgentObject === false){
			this._userAgentObject = r2userAgent(this.request, '');
			Object.freeze(this._userAgentObject);
		}
		return this._userAgentObject;
	}

	constructor(request){
		if(zt.as(request).has('IncomingMessage')){
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
			this._queryList = false;
			this._statusCodeNumber = false;
			this._statusMessageString = false;
			this._userAgentObject = false;
			Object.freeze(this);
		}
		else{
			throw 'wrong request';
		}
	}
}

module.exports = ZRequest;
