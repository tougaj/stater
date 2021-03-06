// Виконує завантаження даних зі сторінок реєстрів.

// Необхідність в даному скрипті обумовлена тим, що я не впевнений у статичності адрес
// файлів для завантаження з плином часу.

// Даний скрипт завантажує сторінку кожного реєстру, знаходить адресу файлу даних,
// завантажує його та зберігає на диску у поточному каталозі.

// TODO: Можливо, є сенс додати статус-бар завантаження даних, але я поки в цьому не впевнений.

const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs');
let httpsProxyAgent = require('https-proxy-agent');
const agent = new httpsProxyAgent('http://login:password@192.168.0.1:3128/');

const regPages = [
	'https://data.gov.ua/dataset/1c7f3815-3259-45e0-bdf1-64dca07ddc10',
	'https://data.gov.ua/dataset/fd25a249-4e5e-4257-b243-b9c16a8d0b6d',
	'https://data.gov.ua/dataset/6266fef2-cfea-409a-9709-86584e8a2c5c',
	'https://data.gov.ua/dataset/b07bc894-7301-4bf2-a796-2708e9729538',
];


function loadRegistryFromPage(pageAddress) {
	let fileName = '';
	return new Promise((resolve, reject) => {
		axios({
				method: 'get',
				url: pageAddress,
				responseType: 'text',
				httpsAgent: agent,
			})
			.then(response => {
				const $ = cheerio.load(response.data);
				const title = $('title').text();
				console.log(`Завантажую: "${title}"`)
				const addresForLoad = $('.resource-url-analytics').attr('href');
				return addresForLoad;
			})
			.then(addresForLoad => {
				let m = addresForLoad.match(/\/([^./]+\.zip)/i);
				if (!m || !m[1]) throw new Error('Помилка отримання імені файла');
				fileName = m[1];
				return axios({
					method:'get',
					url: addresForLoad,
					responseType:'stream',
					httpsAgent: agent,
				});
			})
			.then(response => {
				response.data.pipe(
					fs.createWriteStream(fileName)
						.on('finish', () => {
							resolve(`${fileName} loaded`);
						})
				)
			})
			.catch(err => console.error(err));
	});
};

async function loadRegisters(pages){
	for (let i = 0; i < pages.length; i++){
		await loadRegistryFromPage(pages[i])
			.then(console.log);
	}
	return('All done');
}

loadRegisters(regPages)
	.then(console.log);