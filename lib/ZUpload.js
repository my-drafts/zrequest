#!/usr/bin/env node

'use strict';

/*
 * ZUpload{
 *   d
 *   f
 *   h
 *   n
 *   s
 *   t
 *
 *   disposition
 *   field
 *   name
 *   path
 *   size
 *   type
 *
 *   contentDisposition
 *   contentType
 *   fieldName
 *   fileName
 *   filePath
 *   fileSize
 *   headers
 *
 *   remove()
 * }
 *
 * */

const fs = require('fs');
const zt = require('ztype');

class ZUpload {
	get d() {
		return this.disposition;
	}
	get f() {
		return this.field;
	}
	get h() {
		return this.headers;
	}
	get n() {
		return this.name;
	}
	get p() {
		return this.path;
	}
	get s() {
		return this.size;
	}
	get t() {
		return this.type;
	}

	get disposition() {
		return this.contentDisposition;
	}
	get field() {
		return this.fieldName;
	}
	get name() {
		return this.fileName;
	}
	get path() {
		return this.filePath;
	}
	get size() {
		return this.fileSize;
	}
	get type() {
		return this.contentType;
	}

	get contentDisposition() {
		return this._contentDisposition;
	}
	get contentType() {
		return this._contentType;
	}
	get fieldName() {
		return this._fieldName;
	}
	get fileName() {
		return this._fileName;
	}
	get filePath() {
		return this._filePath;
	}
	get fileSize() {
		return this._fileSize;
	}
	get headers() {
		return this._headers;
	}

	constructor(file) {
		const F = zt.ab(file, {
			o: zt.self,
			else: {}
		});
		const H = zt.ab(file.headers, {
			o: zt.self,
			else: {}
		});
		this._contentDisposition = H['content-disposition'];
		this._contentType = H['content-type'];
		this._fieldName = F.fieldName;
		this._fileName = F.originalFilename;
		this._filePath = F.path;
		this._fileSize = F.size;
		this._headers = Object.assign({}, H);
		Object.freeze(this);
	}

	inspect() {
		return {
			disposition: this.disposition,
			field: this.fieldName,
			name: this.fileName,
			path: this.filePath,
			size: this.fileSize,
			type: this.contentType,
			headers: this.headers
		}
	}

	remove() {
		const path = this.filePath;
		return new Promise(function (resolve, reject) {
			fs.unlink(path, function (error) {
				error ? reject(error) : resolve(path);
			});
		});
	}
};

module.exports = ZUpload;
