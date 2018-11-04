/// <reference path="../../node_modules/@types/jquery/index.d.ts"/>
// <reference path="./definition/moment.d.ts"/>

namespace edr {
	interface IRegistry {
		index: number,
		title: string,
		subtitle: string,
		items: any[],
	}

	let root = $('#divEDRItems');
	let searchString: string = '';

	const REGISTRY: {[index: number]: string} = {
		0: 'Єдиний державний реєстр юридичних осіб та громадських формувань',
		1: 'Єдиний державний реєстр фізичних осіб-підприємців',
		2: 'Реєстр громадських об\'єднань',
		3: 'Реєстр громадських формувань',
		4: 'Державний реєстр друкованих засобів масової інформації та інформаційних агентств як суб’єктів інформаційної діяльності'
	};

	const ATTRIBUTES: {[index: string]: string} = {
		'REG_NUM': 'Реєстраційний&nbsp;№',
		'DATE_REG': 'Дата реєстрації',
		'NAME': 'Назва',
		'SHORT_NAME': 'Коротка назва',
		'EDRPOU': 'ЄДРПОУ',
		'ADRESS': 'Адреса',
		'PHONE': 'Телефон',
		'GOVERNMENT': 'Керівництво',
		'LICENSE': 'Ліцензія',
		'FOUNDERS': 'Засновники',
		'FOUNDER': 'Засновник',
		'ZASNOVN': 'Засновник',
		'KVED': 'К.В.Е.Д.',
		'STATE': 'Стан',
		'BOSS': 'Голова',

		//ФОП
		'FIO': 'П.І.Б.',
		'ADDRESS': 'Адреса',
		'STAN': 'Стан',
		// ЗМІ
		'REG_DATE': 'Дата реєстрації',
		'NAMES_LANG': 'Назви',
		'NAME_LANG': 'Назва',
		'TYPE_DZMI': 'Тип ЗМІ',
		'GOAL_TYPE': 'Цільова аудиторія',
		'ADRES': 'Адреса',
		'REG_OBJ': 'Реєстрант',
		// '': '',
	};

	let checkInit = function(){
		searchString = $('#eSearchStr').focus().select().val() as string;
		if (searchString === '') return;
		searchString = searchString.toUpperCase().replace(/\s{2,}/g, ' ');
		search();
	}

	let drawContents = function(){
		let headers = $('h2', root);
		if (headers.length === 0) return;
		let contents = $('<div><h1>Зміст</h1></div>')
		let ul = $('<ul class="list-unstyled"></ul>');
		headers.each(function(this: Element){
			let headerID = $(this).attr('id');
			$('<li></li>')
				.append(
					$(`<a href="#${headerID}"></a>`)
						.html($(this).html())
				)
				.appendTo(ul);
		});
		contents.append(ul).append('<hr>').prependTo(root);
	}

	let search = function(){
		root.empty().append('<h5 class="text-center"><i class="fa fa-spinner fa-spin fa-lg"></i> Завантаження записів реєстру. Зачекайте...</h5>');
		const data = $('#fmSearch').serialize();
		$.getJSON('api/searchEDR.php', data, (r: IRegistry[]) => {
			root.empty();
			let totalRecCnt = 0;
			r.forEach((element: IRegistry) => {
				totalRecCnt += element.items.length;
				if (element.items.length !== 0) drawRegistry(element);
			});
			if (totalRecCnt !== 0){
				$('#totalRecCnt span').text(totalRecCnt).closest('p').show();
				drawContents();
			} else {
				$('<h4 class="text-center text-warning"><i class="fa fa-info-circle fa-lg"></i> За Вашим запитом записів не знайдено. Спробуйте іншу пошукову строку.</h4>').appendTo(root);
			}
		})
	}

	let getRegistryElement = function(o: any, fTableCanOmit = true): JQuery{
		if ((typeof o) === 'string' || (typeof o) === 'number'){
			let sBadge = '';
			if (o.toUpperCase().replace(/\s{2,}/g, ' ').indexOf(searchString) !== -1) sBadge = '<i class="fa fa-check fa-lg text-success pull-right"></i>';
			return $('<span></span>').html(o).prepend(sBadge);
		} else {
			let keys = [];
			for (let key in o) keys.push(key);

			// Если объект пустой, то выводим пробел
			if (keys.length === 0) return (getRegistryElement('&nbsp;'));

			//  Если объект по факту является массивом, то отрисовываем список
			if (Array.isArray(o)){
				const ul = $('<ol class="table-item"></ol>');
				o.forEach((e: string) => {
					$('<li></li>').append(getRegistryElement(e)).appendTo(ul);
				});
				return ul;
			}

			// Если объект содержит всего один ключ, то опускаем таблицу (если разрешено)
			if (fTableCanOmit && keys.length === 1) return getRegistryElement(o[keys[0]]);

			const table = $('<table class="table table-bordered table-striped"></table>');
			keys.map(key => {
				const keyName = ATTRIBUTES[key] || key;
				$('<tr></tr>')
					.append(`<td title="${key}"><b>${keyName}</b></td>`)
					.append(
						$('<td></td>')
							.append(getRegistryElement(o[key]))
					)
					.appendTo(table);
			})

			// for (let key in o){
			// 	const keyName = ATTRIBUTES[key] || key;
			// 	$('<tr></tr>')
			// 		.append(`<td title="${key}"><b>${keyName}</b></td>`)
			// 		.append(
			// 			$('<td></td>')
			// 				.append(getRegistryElement(o[key]))
			// 		)
			// 		.appendTo(table);
			// }
			return table;
		}
	}

	let drawRegistry = function(r: IRegistry){
		console.log(r)
		const ITEMS_MAX_COUNT = 1000;
		let nCount: number | string = r.items.length;
		if (ITEMS_MAX_COUNT < nCount) nCount = `${ITEMS_MAX_COUNT}<big>+</big>`;
		$(`<h2 class="text-info" id="r${r.index}" style="position: sticky"></h2>`).html(`${r.title} <small>${r.subtitle}</small>`)
			.attr('title', `${r.title} ${r.subtitle}`)
			// .append(`<small> (знайдено об'єктів: ${nCount})</small>`)
			.prepend(`<span class="badge pull-right">${nCount}</span>`)
			.prepend('<i class="fa fa-book"></i> ')
			.appendTo(root);
		r.items.forEach((item, index) => {
			let element: JQuery;
			if (item.WARNING === undefined && item.RAWDATA === undefined){
				let sTitle = item.NAME || item.FIO;
				$('<h3></h3>').text(`${index+1}. ${sTitle}`).appendTo(root);
				element = getRegistryElement(item, false);
			} else {
				if (item.WARNING !== undefined){
					element = $('<div class="alert alert-warning"></div>').html(`<i class="fa fa-exclamation-triangle fa-lg"></i> <b>УВАГА!</b> ${item.WARNING}`);
				} else {
					let data = item.RAWDATA.replace(/</ig, '&lt;').replace(/>/ig, '&gt;<br>')
					$('<h3></h3>').text(`${index+1}. ${item.NAME}`).append('<small> (не структуровані дані)</small>').appendTo(root);
					element = $('<div class="alert alert-info"></div>').html(`<i class="fa fa-info-circle"></i> ${data}`);
				}
			}
			element.appendTo(root);
		});
	}

	$(document).ready(function(){
		checkInit();
	});
};