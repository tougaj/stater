"use strict";
/// <reference path="../../node_modules/@types/jquery/index.d.ts"/>
// <reference path="./definition/moment.d.ts"/>
var edr;
(function (edr) {
    var root = $('#divEDRItems');
    var searchString = '';
    var REGISTRY = {
        0: 'Єдиний державний реєстр юридичних осіб та громадських формувань',
        1: 'Єдиний державний реєстр фізичних осіб-підприємців',
        2: 'Реєстр громадських об\'єднань',
        3: 'Реєстр громадських формувань',
        4: 'Державний реєстр друкованих засобів масової інформації та інформаційних агентств як суб’єктів інформаційної діяльності'
    };
    var ATTRIBUTES = {
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
    };
    var checkInit = function () {
        searchString = $('#eSearchStr').focus().select().val();
        if (searchString === '')
            return;
        searchString = searchString.toUpperCase().replace(/\s{2,}/g, ' ');
        search();
    };
    var drawContents = function () {
        var headers = $('h2', root);
        if (headers.length === 0)
            return;
        var contents = $('<div><h1>Зміст</h1></div>');
        var ul = $('<ul class="list-unstyled"></ul>');
        headers.each(function () {
            var headerID = $(this).attr('id');
            $('<li></li>')
                .append($("<a href=\"#" + headerID + "\"></a>")
                .html($(this).html()))
                .appendTo(ul);
        });
        contents.append(ul).append('<hr>').prependTo(root);
    };
    var search = function () {
        root.empty().append('<h5 class="text-center"><i class="fa fa-spinner fa-spin fa-lg"></i> Завантаження записів реєстру. Зачекайте...</h5>');
        var data = $('#fmSearch').serialize();
        $.getJSON('api/searchEDR.php', data, function (r) {
            root.empty();
            var totalRecCnt = 0;
            r.forEach(function (element) {
                totalRecCnt += element.items.length;
                if (element.items.length !== 0)
                    drawRegistry(element);
            });
            if (totalRecCnt !== 0) {
                $('#totalRecCnt span').text(totalRecCnt).closest('p').show();
                drawContents();
            }
            else {
                $('<h4 class="text-center text-warning"><i class="fa fa-info-circle fa-lg"></i> За Вашим запитом записів не знайдено. Спробуйте іншу пошукову строку.</h4>').appendTo(root);
            }
        });
    };
    var getRegistryElement = function (o, fTableCanOmit) {
        if (fTableCanOmit === void 0) { fTableCanOmit = true; }
        if ((typeof o) === 'string' || (typeof o) === 'number') {
            var sBadge = '';
            if (o.toUpperCase().replace(/\s{2,}/g, ' ').indexOf(searchString) !== -1)
                sBadge = '<i class="fa fa-check fa-lg text-success pull-right"></i>';
            return $('<span></span>').html(o).prepend(sBadge);
        }
        else {
            var keys = [];
            for (var key in o)
                keys.push(key);
            // Если объект пустой, то выводим пробел
            if (keys.length === 0)
                return (getRegistryElement('&nbsp;'));
            //  Если объект по факту является массивом, то отрисовываем список
            if (Array.isArray(o)) {
                var ul_1 = $('<ol class="table-item"></ol>');
                o.forEach(function (e) {
                    $('<li></li>').append(getRegistryElement(e)).appendTo(ul_1);
                });
                return ul_1;
            }
            // Если объект содержит всего один ключ, то опускаем таблицу (если разрешено)
            if (fTableCanOmit && keys.length === 1)
                return getRegistryElement(o[keys[0]]);
            var table_1 = $('<table class="table table-bordered table-striped"></table>');
            keys.map(function (key) {
                var keyName = ATTRIBUTES[key] || key;
                $('<tr></tr>')
                    .append("<td title=\"" + key + "\"><b>" + keyName + "</b></td>")
                    .append($('<td></td>')
                    .append(getRegistryElement(o[key])))
                    .appendTo(table_1);
            });
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
            return table_1;
        }
    };
    var drawRegistry = function (r) {
        console.log(r);
        var ITEMS_MAX_COUNT = 1000;
        var nCount = r.items.length;
        if (ITEMS_MAX_COUNT < nCount)
            nCount = ITEMS_MAX_COUNT + "<big>+</big>";
        $("<h2 class=\"text-info\" id=\"r" + r.index + "\" style=\"position: sticky\"></h2>").html(r.title + " <small>" + r.subtitle + "</small>")
            .attr('title', r.title + " " + r.subtitle)
            // .append(`<small> (знайдено об'єктів: ${nCount})</small>`)
            .prepend("<span class=\"badge pull-right\">" + nCount + "</span>")
            .prepend('<i class="fa fa-book"></i> ')
            .appendTo(root);
        r.items.forEach(function (item, index) {
            var element;
            if (item.WARNING === undefined && item.RAWDATA === undefined) {
                var sTitle = item.NAME || item.FIO;
                $('<h3></h3>').text(index + 1 + ". " + sTitle).appendTo(root);
                element = getRegistryElement(item, false);
            }
            else {
                if (item.WARNING !== undefined) {
                    element = $('<div class="alert alert-warning"></div>').html("<i class=\"fa fa-exclamation-triangle fa-lg\"></i> <b>\u0423\u0412\u0410\u0413\u0410!</b> " + item.WARNING);
                }
                else {
                    var data = item.RAWDATA.replace(/</ig, '&lt;').replace(/>/ig, '&gt;<br>');
                    $('<h3></h3>').text(index + 1 + ". " + item.NAME).append('<small> (не структуровані дані)</small>').appendTo(root);
                    element = $('<div class="alert alert-info"></div>').html("<i class=\"fa fa-info-circle\"></i> " + data);
                }
            }
            element.appendTo(root);
        });
    };
    $(document).ready(function () {
        checkInit();
    });
})(edr || (edr = {}));
;
