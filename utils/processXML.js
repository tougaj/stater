'use strict';

console.clear();

const fs = require('fs');
const transformer = require('./transformer');
var iconv = require('iconv-lite');

// function getProcess(sText,oldTime){
// 	const elapsed = ((new Date())-oldTime)/1000;
// 	return `elapsed ${elapsed} s: ${sText}`;
// 	// console.log(`elapsed ${elapsed} s: ${sText}`);
// }

function convertFile(fileName){
	console.info(`Processing file ${fileName}...`);
	const startTime = new Date().valueOf();
	let newFileName = fileName.replace(/xml$/i, 'txt');

	// return fs.createReadStream(fileName)
	// 	.pipe(iconv.decodeStream('win1251'))
	// 	.pipe(iconv.encodeStream('utf8'))
	// 	.pipe(fs.createWriteStream(newFileName));

	let t_opts = {
		readableObjectMode: false, //читать из потока Transform будут строки или буфер
		writableObjectMode: false, //записывать в поток можно либо строки или буфер
		// encoding: 'win1251',
		decodeStrings: false,
		fileSize: fs.statSync(fileName).size,
	};
	const recordSeparator = new transformer.RecordSeparator(t_opts);
	// const recordSeparator = new transformer.RecordSeparator();

	return new Promise((resolve, reject) => {
		// fs.createReadStream(fileName, {highWaterMark: 1*1024*1024})
		fs.createReadStream(fileName)
			// .pipe(iconv.decodeStream('win1251'))
			.pipe(recordSeparator)
			// .pipe(iconv.encodeStream('win1251'))
			// .pipe(iconv.encodeStream('utf8'))
			.pipe(
				fs.createWriteStream(newFileName)
					.on('finish', () => {
						// logProcess(`file ${fileName} done`, startTime);
						// resolve(`file ${fileName} done`);
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

// const dataPath = 'c:/EDR/';
const dataPath = './';
let files = [];
fs.readdirSync(dataPath).forEach(fileName => {
	if (fileName.endsWith('xml')) files.push(`${dataPath}${fileName}`);
});
convertFiles(files)
	.then(console.log)
	.catch(console.error);
