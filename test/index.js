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
	if (req.path === '/') {
		const head = '<title>test frontpage</title>';
		const body = '\
<ul>\
<li><a href="/">frontpage</a><li>\
<li><a href="/post-multipart-form-data/">POST: multipart/form-data</a><li>\
<li><a href="/post-application-json/">POST: application/json</a><li>\
<li><a href="/post-application-x-www-form-urlencoded/">POST: application/x-www-form-urlencoded</a><li>\
<li><a href="/post-text-plain/">POST: text/plain</a><li>\
<li><a href="/post/">POST</a><li>\
<li><a href="/get/">GET</a><li>\
<li><a href="/submit-simple/">submit-simple</a><li>\
<li><a href="/submit-complex/">submit-complex</a><li>\
</ul>\
		';
		console.log(String(req));
		console.log('---');
		response.end(uf(HTML, head, body));
	}
	else if (req.path === '/submit-simple/'){
		console.log(String(req));
		console.log('---');
		response.end(String(req));
	}
	else if (req.path === '/submit-complex/'){
		const options = require('./config');
		req.init(options).then(function () {
			return new Promise(function (resolve, reject) {
				const uploadDirPath = __dirname.replace(/[^\/]+$/, '') + options.postAndUploadInit.directory;
				fs.readdir(uploadDirPath, function (error, files) {
					error ? reject(error) : resolve(files);
				});
			});
		}).then(function (files) {
			console.log(files);
			return req.final(options);
		}).then(function () {
			console.log(String(req));
			console.log('---');
			response.end(String(req));
		}).catch(function (error) {
			console.log(error);
			console.log('---');
			response.end(String(error));
		});
	}
	else if (req.path === '/post-multipart-form-data/') {
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
		console.log(String(req));
		console.log('---');
		response.end(uf(HTML, head, body));
	}
	else if (req.path === '/post-application-json/') {
		const head = '<title>post: application/json</title>';
		const body = '\
<form method="POST" action="/submit-complex/" enctype="application/json">\
<input type="text" name="aa" value="" />\
<input type="text" name="aa" value="" />\
<input type="text" name="bb" value="" />\
<input type="file" multiple="multiple" name="ff" value="" />\
<input type="submit" value="submit" />\
<input type="reset" value="reset" />\
</form>\
		';
		console.log(String(req));
		console.log('---');
		response.end(uf(HTML, head, body));
	}
	else if (req.path === '/post-application-x-www-form-urlencoded/') {
		const head = '<title>post: application/x-www-form-urlencoded</title>';
		const body = '\
<form method="POST" action="/submit-complex/" enctype="application/x-www-form-urlencoded">\
<input type="text" name="aa" value="" />\
<input type="text" name="aa" value="" />\
<input type="text" name="bb" value="" />\
<input type="file" multiple="multiple" name="ff" value="" />\
<input type="submit" value="submit" />\
<input type="reset" value="reset" />\
</form>\
		';
		console.log(String(req));
		console.log('---');
		response.end(uf(HTML, head, body));
	}
	else if (req.path === '/post-text-plain/') {
		const head = '<title>post: text/plain</title>';
		const body = '\
<form method="POST" action="/submit-complex/" enctype="text/plain">\
<input type="text" name="aa" value="" />\
<input type="text" name="aa" value="" />\
<input type="text" name="bb" value="" />\
<input type="file" multiple="multiple" name="ff" value="" />\
<input type="submit" value="submit" />\
<input type="reset" value="reset" />\
</form>\
		';
		console.log(String(req));
		console.log('---');
		response.end(uf(HTML, head, body));
	}
	else if (req.path === '/post/') {
		const head = '<title>post</title>';
		const body = '\
<form method="POST" action="/submit-complex/">\
<input type="text" name="aa" value="" />\
<input type="text" name="aa" value="" />\
<input type="text" name="bb" value="" />\
<input type="file" multiple="multiple" name="ff" value="" />\
<input type="submit" value="submit" />\
<input type="reset" value="reset" />\
</form>\
		';
		console.log(String(req));
		console.log('---');
		response.end(uf(HTML, head, body));
	}
	else if (req.path === '/get/') {
		const head = '<title>get</title>';
		const body = '\
<form method="GET" action="/submit-simple/">\
<input type="text" name="aa" value="" />\
<input type="text" name="aa" value="" />\
<input type="text" name="bb" value="" />\
<input type="file" multiple="multiple" name="ff" value="" />\
<input type="submit" value="submit" />\
<input type="reset" value="reset" />\
</form>\
		';
		console.log(String(req));
		console.log('---');
		response.end(uf(HTML, head, body));
	}
	else {
		console.log(String(req));
		console.log('---');
		response.end(String(req));
	}
}).on('error', function (error) {
	console.log(error);
	console.log('---');
}).listen(8080);
