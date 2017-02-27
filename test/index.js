#!/usr/bin/env node

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const uf = require('util').format;
const ZRequest = require('../').ZRequest;
const zt = require('ztype');

const HTML = '<html><head>%s</head><body>%s</body></html>';

http.createServer(function (request, response) {
	let req = new ZRequest(request);
	//console.log(String(req));
	if (req.path === '/') {
		const head = '<title>test frontpage</title>';
		const body = '\
<ul>\
<li><a href="/">frontpage</a><li>\
<li><a href="/multipart-form-data/">multipart/form-data</a><li>\
<li><a href="/application-json/">application/json</a><li>\
<li><a href="/application-www-urlencoded-form-data/">application/www-urlencoded-form-data</a><li>\
<li><a href="/text-plain/">text/plain</a><li>\
</ul>\
		';
		response.end(uf(HTML, head, body));
	}
	else if (req.path === '/submit-simple/'){
		console.log(String(req));
		response.end(String(req));
	}
	else if (req.path === '/submit-complex/'){
		const options = require('./config');
		req.init(options).then(function () {
			return new Promise(function (resolve, reject) {
				const uploadDirPath = __dirname.replace(/[\/][^\/]+$/, '') + options.postAndUploadInit.directory;
				fs.readdir(uploadDirPath, function (error, files) {
					error ? reject(error) : resolve(files);
				});
			});
		}).then(function (files) {
			console.log(files);
			return req.final(options);
		}).then(function () {
			console.log(String(req));
			response.end(String(req));
		}).catch(function (error) {
			console.log(error);
			response.end(String(error));
		});
	}
	else if (req.path === '/multipart-form-data/') {
		const head = '<title>post: multipart/form-data</title>';
		const body = '\
<form method="POST" action="/submit-complex/" enctype="multipart/form-data">\
<input type="text" name="aa" value="" />\
<input type="text" name="aa" value="" />\
<input type="text" name="bb" value="" />\
<input type="file" multiple="multiple" name="ff" value="" />\
<input type="submit" value="submit" />\
<input type="reset" value="reset" />\
</form>\
		';
		response.end(uf(HTML, head, body));
	}
	else if (req.path === '/application-json/') {
		const head = '<title>post: application/json</title>';
		const body = '\
<form method="POST" action="/post" enctype="application/json">\
<input type="text" name="aa" value="" />\
<input type="text" name="aa" value="" />\
<input type="text" name="bb" value="" />\
<input type="file" multiple="multiple" name="ff" value="" />\
<input type="submit" value="submit" />\
<input type="reset" value="reset" />\
</form>\
		';
		response.end(uf(HTML, head, body));
	}
	else {
		console.log('else:');
		console.log(String(req));
		response.end(String(req));
	}
}).on('error', function (error) {
	console.log(error);
}).listen(8082);
