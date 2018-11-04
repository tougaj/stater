'use strict';
var iconv = require('iconv-lite');
var ProgressBar = require('progress');
const {Transform} = require('stream');

class RecordSeparator extends Transform{
	constructor(opt = {}){
		super(opt);
		// this.byteCounter = 0;
		// this.totalBytes = opt.fileSize;
		this.bar = new ProgressBar(':elapseds :percent [:bar] :etas', {
			total: opt.fileSize,
			renderThrottle: 100,
			width: 50,
			// head: '-',
			incomplete: ' ',
			complete: '=',
		});
		// console.log('\n -------- Transform in constructor');
		// console.log('objectMode ', this._writableState.objectMode);//false по умолчанию, если не задано явно true
		// console.log('highWaterMark ', this._writableState.highWaterMark);//16384
		// console.log('decodeStrings ', this._writableState.decodeStrings);//true по умолчанию; пеобразовывать ли в Buffer данные, до их передачи в метод _write()
		// console.log('buffer ', this._writableState.getBuffer());//[] - пустой массив

		// this
		// 	.on('close', () => {
		// 		console.log('\n------ Transform on close');
		// 	})
		// 	.on('drain', () => {
		// 		console.log('\n------ Transform on drain');
		// 	})
		// 	.on('error', (err)=> {
		// 		console.log('\n------ Transform on error', err);
		// 	})
		// 	.on('finish', () => {
		// 		console.log('\n------ Transform on finish');
		// 	})
		// 	.on('end', () => {
		// 		console.log('\n------ Transform on end');
		// 	})
		// 	.on('pipe', () => {
		// 		console.log('\n------ Transform on pipe');
		// 	});
	}
	/**
	* метод, реализующий в себе запись данных (chunk поступают в поток Transform), 
	* и чтение данных - когда другой поток читает из Transform
	* @param chunk
	* @param encoding
	* @param done - в общем случае done(err, chunk)
	* @private
	*/
	_transform(chunk, encoding, done){
		// this.byteCounter += chunk.length;
		// console.log(`${(this.byteCounter/1024/1024).toFixed(2)} mB processed`);
		// console.log(`${(this.byteCounter/this.totalBytes*100).toFixed(1)} % processed`);
		this.bar.tick(chunk.length);
		let decoded = iconv.decode(chunk, 'win1251');
		// console.log(decoded);
		// decoded = decoded.replace(/<(\/?)(?:record)>/ig, '<$1ITEM>');
		let encoded = iconv.encode(decoded, 'win1251');
		this.push(encoded);
		done();
		/*завершить обработку текущих данных chunk, и передать дальше на чтение можно двумя вариантами
		done(null, chunk); 
		done(err, chunk); - в этом случае будет вызвано событие error
		или так, что то же самое:
		this.push(chunk);
		done();

		this.push(chunk);
		done(err);*/
		//преобразовали выходные данные в экземпляр класса Chunk (см. пример writable.js)
		// this.push(new Chunk(chunk));
		// done();
	}
	/**
	* Кастомные transform потоки могут реализовать метод _flush.
	Он будет вызван, когда нет больше данных на запись, но перед событием 'end' потока Readable (имеется ввиду Transform, так как это поток и на запись, и на чтение данных).
	* @param done - done(err) можно передать объект ошибки Error
	* @private
	*/
	_flush(done){
		//TODO ... что-нибудь сделали дополнительно перед завершением работы потока
		// this.push('done');
		done();
	}
}
module.exports.RecordSeparator = RecordSeparator;