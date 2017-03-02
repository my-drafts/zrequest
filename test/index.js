#!/usr/bin/env node

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const swig = require('swig');
const uf = require('util').format;
const zt = require('ztype');
const ZRequest = require('../').ZRequest;

const cpuUsed = function () {
	return '?'; //process.cpuUsage();
};

const memUsed = module.exports.memUsed = function () {
	var units = ['', 'kb', 'mb', 'gb'],
		unit, mem = process.memoryUsage();
	var total = mem.heapTotal;
	for (unit = 0; total > 1024 && unit < units.length; unit++) {
		total /= 1024;
	}
	var result = {
		size: total.toFixed(3),
		unit: units[unit],
		total: mem.heapTotal
	};
	return result;
};

const tpl = new swig.Swig({
	cache: false,
	locals: {},
	loader: swig.loaders.fs('./test/storage', {
		encoding: 'utf8'
	})
});

http.createServer(function (request, response) {
		console.log(1, memUsed(), cpuUsed());
		let req = new ZRequest(request);
		console.log(2, memUsed(), cpuUsed());
		req.load({})
			.then(function () {
				console.log(3, memUsed(), cpuUsed());
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
								req.final({})
									.then(function () {
										response.end(String(req));
									})
									.catch(function (error) {
										response.end(String(error));
									});
								break;
							case '/submit-json/':
								req.final({})
									.then(function () {
										response.end(String(req));
									})
									.catch(function (error) {
										response.end(String(error));
									});
								break;
							default:
								response.end(String(req));
						}
						break;
					default:
						response.end(String(req));
				}
				console.log(6, memUsed(), cpuUsed());
			})
			.catch(function (error) {
				console.log(7, memUsed(), cpuUsed());
				response.end(String(error));
			});
		console.log(8, memUsed(), cpuUsed());
	})
	.on('error', function (error) {
		console.log(9, memUsed(), cpuUsed());
		console.log(String(error));
		console.log('---');
	})
	.listen(8080);

console.log(0, memUsed(), cpuUsed());
