'use strict';

const fs = require('fs');
var iconv = require('iconv-lite');
 
function logProcess(sText,oldTime){
	const elapsed = ((new Date())-oldTime)/1000;
	// return `elapsed ${elapsed} s: ${sText}`;
	console.log(`elapsed ${elapsed} s: ${sText}`);
}

function clearFile(fileName){
	console.log(`\nprocessing file ${fileName}...`);
	const startTime = new Date().valueOf();

	let buf = fs.readFileSync(fileName);
	logProcess('readed', startTime);

	let sText = iconv.decode(buf, 'win1251');
	logProcess('decoded', startTime);
	
	sText = sText.replace(/<\/RECORD></ig, '</RECORD>\n<');
	logProcess('replaced', startTime);

	buf = iconv.encode(sText, 'win1251');
	logProcess('encoded', startTime);

	let newFileName = fileName.replace(/xml$/i, 'txt');
	fs.writeFileSync(newFileName, buf);	

	logProcess(`file ${fileName} done`, startTime);

	// console.log(sText);

	// let sText = fs.readFileSync(fileName, 'latin1');
	// logProcess('readed', startTime);
	
	// sText = sText.replace(/<\/RECORD></ig, '</RECORD>\n<');
	// logProcess('replaced', startTime);

	// let newFileName = fileName.replace(/xml$/i, 'txt');
	// fs.writeFileSync(newFileName, sText, 'latin1');	

	// logProcess(`file ${fileName} done`, startTime);
}

// console.log(files);
// (async () => {
// 	for (let i = 0; i < files.length; i++){
// 		// let result = await clearFile(files[i]);
// 		// console.log(result);
// 		await clearFile(files[i])
// 			.then(console.log);
// 	}
// 	console.log('All Done');
// })();
// console.log('All Done !!!!!');

// fs.readdirSync(dataPath).forEach(fileName => {
// 	if (fileName.toLowerCase().endsWith('xml')){
// 		(async () => {
// 			await clearFile(`${dataPath}${fileName}`)
// 				.then(console.log);
// 		})();
// 	}
// });


// (async () => {
// 	let a = await clearFile(`${dataPath}15.1-EX_XML_EDR_UO.xml`);
// 	console.log(a);
// })()

// (async () => {
// 	await clearFile(`${dataPath}15.1-EX_XML_EDR_UO.xml`)
// 		.then(console.log);
// 	await clearFile(`${dataPath}1.xml`)
// 		.then(console.log);
// })();

// clearFile(`${dataPath}15.1-EX_XML_EDR_UO.xml`)
// 	.then(console.log);
const dataPath = './';
// clearFile(`${dataPath}1.xml`);
clearFile(`${dataPath}15.1-EX_XML_EDR_UO.xml`);

// fs.readdirSync(dataPath).forEach(fileName => {
// 	if (fileName.toLowerCase().endsWith('xml')) clearFile(`${dataPath}${fileName}`);
// });
