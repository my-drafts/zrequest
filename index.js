#!/usr/bin/env node

'use strict';

/*
 * ZRequest{
 *  acceptTypes: [{mime: '*', q: 1, subtype: '', type: '*'}, ...],
 *  acceptCharsets: [{charset: '*', q: 1}, ...],
 *  acceptEncodings: [{encoding: '*', q: 1}, ...],
 *  acceptLanguages: [{language: '*', local: '*', location: '*', q: 1}, ...],
 *  contentTypes: {mime: '-/-', subtype: '-', type: '-', key: value, ...},
 *  cc -> COOKIE -> cookies: {key: value, ...},
 *  d -> dir -> directory: '/',
 *  hh -> headers: {key: value, ...},
 *  h -> host: '*',
 *  httpVersion: '?',
 *  f -> file: '',
 *  m -> method: '*',
 *  options: {...},
 *  p -> path: '/',
 *  pp -> paths: ['directory1', 'directory2', ..., 'file'],
 *  n -> number -> port: 0,
 *  POST -> posts: {field: [data, ...], ...},
 *  r -> request: request,
 *  QUERY -> queries: {field: [data, ...], ...},
 *  c -> code -> statusCode: 0,
 *  message -> statusMessage: '',
 *  UPLOAD -> uploads: {field: [ZUpload, ...], ...},
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
 *
 * ZUpload{
 *   get d -> disposition -> contentDisposition
 *   get f -> field -> fieldName
 *   get h -> headers
 *   get n -> name -> fileName
 *   get p -> path -> filePath
 *   get s -> size -> fileSize
 *   get t -> type -> contentType
 *
 *   remove()
 * }
 *
 * */

const ZRequest = require('./lib/ZRequest');
const ZUpload = require('./lib/ZUpload');

module.exports.ZRequest = ZRequest;
module.exports.ZUpload = ZUpload;
