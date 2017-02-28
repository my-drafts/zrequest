#!/usr/bin/env node

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const uf = require('util').format;
const swig = require('swig');
const ZRequest = require('../').ZRequest;
const zt = require('ztype');

const tpl = new swig.Swig({
  cache: false,
  locals: {},
  loader: swig.loaders.fs('./test/storage', {
    encoding: 'utf8'
  })
});

http.createServer(function (request, response) {
  let req = new ZRequest(request);
  console.log('===');
  console.log(String(req));
  console.log('---');
  if (req.path === '/') {
    const filePath = 'front-page/index.html';
    tpl.renderFile(filePath, {}, function (error, html) {
      response.end(error ? String(error) : html);
    });
  }
  else if (req.path === '/post-multipart-form-data/') {
    const filePath = 'post/multipart-form-data.html';
    tpl.renderFile(filePath, {}, function (error, html) {
      response.end(error ? String(error) : html);
    });
  }
  else if (req.path === '/post-application-json/') {
    const filePath = 'post/application-json.html';
    tpl.renderFile(filePath, {}, function (error, html) {
      response.end(error ? String(error) : html);
    });
  }
  else if (req.path === '/post-application-x-www-form-urlencoded/') {
    const filePath = 'post/application-x-www-form-urlencoded.html';
    tpl.renderFile(filePath, {}, function (error, html) {
      response.end(error ? String(error) : html);
    });
  }
  else if (req.path === '/post-text-plain/') {
    const filePath = 'post/text-plain.html';
    tpl.renderFile(filePath, {}, function (error, html) {
      response.end(error ? String(error) : html);
    });
  }
  else if (req.path === '/post/') {
    const filePath = 'post/index.html';
    tpl.renderFile(filePath, {}, function (error, html) {
      response.end(error ? String(error) : html);
    });
  }
  else if (req.path === '/get/') {
    const filePath = 'get/index.html';
    tpl.renderFile(filePath, {}, function (error, html) {
      response.end(error ? String(error) : html);
    });
  }
  else if (req.path === '/submit-simple/') {
    response.end(String(req));
  }
  else if (req.path === '/submit-complex/') {
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
      response.end(String(req));
    }).catch(function (error) {
      console.log(error);
      response.end(String(error));
    });
  }
  else {
    response.end(String(req));
  }
}).on('error', function (error) {
  console.log(error);
  console.log('---');
}).listen(8080);
