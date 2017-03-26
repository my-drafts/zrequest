#!/usr/bin/env node

'use strict';

const http = require('http');
const process = require('process');
const swig = require('swig');
const uf = require('util').format;
const usage = require('usage');
const zt = require('ztype');
const ZRequest = require('../').ZRequest;

const tpl = new swig.Swig({
	cache: false,
	locals: {},
	loader: swig.loaders.fs('storage', {
		encoding: 'utf8'
	})
});

const port = 8080;

http.createServer(function (request, response) {
		usage.lookup(process.pid, {
			keepHistory: false
		}, function (error, used) {
			console.log(error ? error : used);
		});

		let req = new ZRequest(request, require('./config.json'));
		req.load({})
			.then(function () {
				//console.log(String(req));
				//console.log('---');
				switch (req.method) {
					case 'get':
						switch (req.path) {
							case '/':
								let f1 = 'front-page/index.html';
								tpl.renderFile(f1, {}, function (error, html) {
									response.end(error ? String(error) : html);
								});
								break;
							case '/post-multipart-form-data/':
								let f2 = 'post/multipart-form-data.html';
								tpl.renderFile(f2, {}, function (error, html) {
									response.end(error ? String(error) : html);
								});
								break;
							case '/post-application-json/':
								let f3 = 'post/application-json.html';
								tpl.renderFile(f3, {}, function (error, html) {
									response.end(error ? String(error) : html);
								});
								break;
							case '/post-application-x-www-form-urlencoded/':
								let f4 = 'post/application-x-www-form-urlencoded.html';
								tpl.renderFile(f4, {}, function (error, html) {
									response.end(error ? String(error) : html);
								});
								break;
							case '/post-text-plain/':
								let f5 = 'post/text-plain.html';
								tpl.renderFile(f5, {}, function (error, html) {
									response.end(error ? String(error) : html);
								});
								break;
							case '/post/':
								let f6 = 'post/index.html';
								tpl.renderFile(f6, {}, function (error, html) {
									response.end(error ? String(error) : html);
								});
								break;
							case '/get/':
								let f7 = 'get/index.html';
								tpl.renderFile(f7, {}, function (error, html) {
									response.end(error ? String(error) : html);
								});
								break;
							case '/close/':
								response.end('close');
								setImmediate(function () {
									console.log(uf('Server stoped.'));
									process.exit(0);
								})
								break;
							default:
								response.end(String(req));
						}
						break;
					case 'post':
						switch (req.path) {
							case '/submit-simple/':
								response.end(String(req));
								break;
							case '/submit-complex/':
							console.log(String(req));
								req.final({})
									.then(function () {
										response.end(String(req));
									})
									.catch(function (error) {
										response.end(String(error) + '\n1\n' + String(error.stack));
									});
								break;
							case '/submit-json/':
								req.final({})
									.then(function () {
										response.end(String(req));
									})
									.catch(function (error) {
										response.end(String(error) + '\n2\n' + String(error.stack));
									});
								break;
							default:
								response.end(String(req));
						}
						break;
					default:
						response.end(String(req));
				}
			})
			.catch(function (error) {
				response.end(String(error) + '\n3\n' + String(error.stack));
			});
	})
	.on('error', function (error) {
		console.log(String(error) + '\n4\n' + String(error.stack));
		console.log('---');
	})
	.listen(port);

console.log(uf('Server started at %s port.', port));
