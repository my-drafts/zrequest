#!/usr/bin/env node

'use strict';

const http = require('http');
const ZRequest = require('../').ZRequest;
const zt = require('ztype');

http.createServer(function (request, response) {
	let req = new ZRequest(request);
	//console.log(String(req));
	if (req.path === '/f/') {
		const html = '\
<html>\
<body>\
<form method="POST" action="/post" enctype="multipart/form-data">\
<input type="text" name="aa" value="" />\
<input type="text" name="aa" value="" />\
<input type="text" name="bb" value="" />\
<input type="file" name="ff" value="" />\
<input type="submit" value="submit" />\
<input type="reset" value="reset" />\
</form>\
</body>\
</html>\
		';
		response.end(html);
	}
	else {
		req.init().then(function () {
			return req.uploadClean();
		}).then(function () {
			console.log(String(req));
			response.end(String(req));
		}).catch(function (error) {
			console.log(error);
			response.end(String(error));
		});
	}
}).on('error', function (error) {
	console.log(error);
}).listen(8080);
