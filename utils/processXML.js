'use strict';

console.clear();

const fs = require('fs');
const transformer = require('./transformer');

function convertFile(fileName){
	console.info(`Processing file ${fileName}...`);
	const startTime = new Date().valueOf();
	const newFileName = fileName.replace(/xml$/i, 'dat');

	// return fs.createReadStream(fileName)
	// 	.pipe(iconv.decodeStream('win1251'))
	// 	.pipe(iconv.encodeStream('utf8'))
	// 	.pipe(fs.createWriteStream(newFileName));

	const t_opts = {
		readableObjectMode: false, //читать из потока Transform будут строки или буфер
		writableObjectMode: false, //записывать в поток можно либо строки или буфер
		decodeStrings: false,
		fileSize: fs.statSync(fileName).size,
	};
	const recordSeparator = new transformer.RecordSeparator(t_opts);
	// const recordSeparator = new transformer.RecordSeparator();

	return new Promise((resolve, reject) => {
		// fs.createReadStream(fileName, {highWaterMark: 1*1024*1024})
		// fs.createReadStream(fileName, {highWaterMark: 10})
		fs.createReadStream(fileName)
			// .pipe(iconv.decodeStream('win1251'))
			.pipe(recordSeparator)
			// .pipe(iconv.encodeStream('win1251'))
			// .pipe(iconv.encodeStream('utf8'))
			.pipe(
				fs.createWriteStream(newFileName)
					.on('finish', () => {
						resolve(`File ${fileName} done\n`);
					})
			);
	});
}

function convertFiles(files){
	return new Promise(async (resolve, reject) => {
		// await convertFile(files[1])
		// 	.then(console.log);
		for (let i = 0; i < files.length; i++){
			await convertFile(files[i])
				.then(console.log);
		}
		resolve('Files converted');
	})
}

// const dataPath = 'd:/Temp/EDR/';
const dataPath = 'd:/EDR/';
// const dataPath = './';
let files = [];
fs.readdirSync(dataPath).forEach(fileName => {
	if (fileName.toLowerCase().endsWith('xml')) files.push(`${dataPath}${fileName}`);
});
convertFiles(files)
	.then(console.log)
	.catch(console.error);
