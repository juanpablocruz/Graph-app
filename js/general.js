'use strict';
var data, tipo;
var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
window.onerror = function (msg, url, ln, cl, err) {
	switch (err.message) {
	case "Unexpected token u":
	case "Cannot read property 'color' of undefined":
		$("#error").css("display", "block");

		$(document).on("click", "#error", function () {
			localStorage.clear();
			$(this).css("display", "none");
			location.reload();
		});
		break;
	}
};
function xlsxworker(data, cb) {
	var worker = new Worker('js/xlsxworker.min.js'), arr;

	worker.onmessage = function (e) {
		switch (e.data.t) {
		case 'e':
			console.error(e.data.d);
			break;
		case 'xlsx':
			cb(JSON.parse(e.data.d));
			break;
		}
	};
	arr = rABS ? data : btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
	worker.postMessage({d: arr, b: rABS});
}
function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function (sheetName) {
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
			result[sheetName] = roa;
		}
	});
	return result;
}

var tarea = document.getElementById('b64data');
function b64it() {
	var wb = XLSX.read(tarea.value, {type: 'base64'});
	process_wb(wb);
}

function process_wb(wb) {
	var output = "";
	output = to_json(wb).Hoja1;

	data = JSON.stringify(output, 2, 2);
	localStorage.data = data;
	tipo = localStorage.chartType;
	$(".loader").toggle();
	_("#graph").display_table(wb.Sheets);

}

function inhandle(e) {
	data = e.target.result;
	if (typeof Worker !== 'undefined') {
		xlsxworker(data, process_wb);
	} else {
		if (rABS) {
			wb = XLSX.read(data, {type: 'binary'});
		} else {
			arr = String.fromCharCode.apply(null, new Uint8Array(data));
			wb = XLSX.read(btoa(arr), {type: 'base64'});
		}
		process_wb(wb);
	}
}

function handleDrop(e) {
	e.stopPropagation();
	e.preventDefault();
	var files = e.dataTransfer.files, i, f, reader, name, data, wb, arr;
	for (i = 0, f = files[i]; i !== files.length; ++i) {
		reader = new FileReader();
		name = f.name;
		reader.onload = inhandle;
		if (rABS) {
			reader.readAsBinaryString(f);
		} else {
			reader.readAsArrayBuffer(f);
		}
	}
}

function dragevents() {
	$("#attr-grupos>ul>li").droppable({
		addClasses : false,
		accept: ".data-list-li",
		drop: function (e, ui) {
			$(this).find("ul").append(ui.draggable);
		}
	});
	var oldList, newList, item;
	$(".sortable-group-list > ul").sortable({
		start: function (event, ui) {
			item = ui.item;
			newList = oldList = ui.item.parent();
		},
		stop: function (event, ui) {

		// perform action here
		},
		change: function (event, ui) {
			if (ui.sender) {
				newList = ui.placeholder.parent();
			}
		},
		connectWith: ".sortable-group-list > ul",
		dropOnEmpty: true,
		forceHelperSize: true,
		forcePlaceholderSize: true
	}).disableSelection();
}
function handleDragover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}
function cargar(data, tipo) {
	if (typeof data === "undefined") {
		localStorage.clear();
	} else {
		switch (tipo) {
		case "Tartas":
			if (typeof data[0] !== "undefined" &&
							Object.keys(data[0]).indexOf("label") > -1) {
				_("#graph").pie({data: data});
				$("#save").attr("download", "Grafico-tarta");
				changeStep($(".current_step"), "next");
			} else {
				localStorage.removeItem(data);
				alert("error de archivo");
			}
			break;
		case "Barras":
			_("#graph").bars({data: data});
			$("#save").attr("download", "Grafico-barras");
			changeStep($(".current_step"), "next");
			break;
		case "Históricos":
			_("#graph").history({data: data});
			$("#save").attr("download", "Grafico-historico");
			changeStep($(".current_step"), "next");
			break;
		}
	}
}
function changeStep(obj, dir) {
	switch (dir) {
	case "prev":
		$(obj).removeClass("current_step").prev().first().addClass("current_step");
		break;
	case "next":
		$(obj).removeClass("current_step").next().first().addClass("current_step");
		break;
	}
}
$(function () {
	console_welcome();
	if (localStorage.data === "undefined") {
		localStorage.clear();
	}
	var tarea = document.getElementById('b64data'), drop = document.getElementById('drop'), iStep;
	if (drop.addEventListener) {
		drop.addEventListener('dragenter', handleDragover, false);
		drop.addEventListener('dragover', handleDragover, false);
		drop.addEventListener('drop', handleDrop, false);
	}

	if (localStorage.chartType) {
		if (localStorage.data) {
			changeStep($(".current_step"), "next");
			changeStep($(".current_step"), "next");
		} else {
			$(".step-info ul").html("");
			iStep = $("<li><div class='halfCircleRight'>" + localStorage.chartType + "</div></li>");
			iStep.css("z-index", 4);
			$(".step-info ul").append(iStep);
		    changeStep($(".current_step"), "next");
		}
	}

	_("#tipoGrafico nav ul").menu();
	if (localStorage.data) {
		if (localStorage.chartType) {
			data = JSON.parse(localStorage.data);
			tipo = localStorage.chartType;
			cargar(data, tipo);
		}
	}

	$(document).on("click", "#nuevo-graph", function () {
		$("#output").html("");
		$(".current_step").removeClass("current_step");
		$("#tipoGrafico").addClass("current_step");
	});

	$(document).on("click", ".back", function () {
		changeStep($(".current_step"), "prev");
	});

	$(document).on("click", "#tipoGrafico nav ul li", function () {
		var tx = $(this).attr("tipo"), iStep;
		$("nav .active").removeClass("active");
		$(this).addClass("active");
		localStorage.clear();
		sessionStorage.clear();
		$("#controls").html("");
		localStorage.chartType = tx;
		$(".step-info ul").html("");
		iStep = $("<li><div class='halfCircleRight'>" + tx + "</div></li>");
		iStep.css("z-index", 4);
		$(".step-info ul").append(iStep);

		_("#barstype nav ul").type_menu();
		changeStep($(this).parent().parent().parent(), "next");
	});

	$(document).on("click", "#barstype nav ul li", function () {
		var tx = $(this).attr("tipo"), iStep = "";
		$(".step-info ul").html("");

		istep = $("<li><div class='halfCircleRight'>" + localStorage.chartType + "</div></li>");
		istep.css("z-index", 4);
		$(".step-info ul").append(istep);

		istep = $("<li><div class='halfCircleRight'>" + tx + "</div></li>");
		istep.css("left", "-13px");
		istep.css("z-index", "0");
		$(".step-info ul").append(istep);
		changeStep($(this).parent().parent().parent().parent(), "next");
	});

	$(document).on("click", "#pie_simple", function () {
		$(".complex_pie").addClass("simple_pie");
		$(".active").removeClass("active");
		$(this).addClass("active");
		pie_mode = "simple";
		localStorage.pie_mode = pie_mode;
		$("#output").html("");
		var fs = $("#fileSelect").clone();
		$("#fileSelect").replaceWith(fs);
	});

	$(document).on("click", "#pie_complex", function () {
		$(".complex_pie").removeClass("simple_pie");
		$(".active").removeClass("active");
		$(this).addClass("active");
		pie_mode = "complex";
		localStorage.pie_mode = pie_mode;
		$("#output").html("");
		var fs = $("#fileSelect").clone();
		$("#fileSelect").replaceWith(fs);
	});

	$(document).on("click", "#bars_compuesto", function () {
		$(".complex_pie").removeClass("simple_pie");
		$(".active").removeClass("active");
		$(this).addClass("active");
		barras_mode = "compuesto";
		if (localStorage.coloresBarras) {
			localStorage.removeItem("coloresBarras");
		}
		localStorage.barras_mode = barras_mode;
		$("#output").html("");
		var fs = $("#fileSelect").clone();
		$("#fileSelect").replaceWith(fs);
	});

	$(document).on("click", "#bars_cols", function () {
		$(".complex_pie").addClass("simple_pie");
		$(".active").removeClass("active");
		$(this).addClass("active");
		barras_mode = "cols";
		if (localStorage.coloresBarras) {
			localStorage.removeItem("coloresBarras");
		}
		localStorage.barras_mode = barras_mode;
		$("#output").html("");
		var fs = $("#fileSelect").clone();
		$("#fileSelect").replaceWith(fs);
	});



	$(document).on("click", "#create-group", function () {
		var x = $("<li class='sortable-group-list'><span contenteditable='true' class='grupo_tag complex_pie' val='0'>Grupo</span></li>"),
			ul = $("<ul> </ul>");
		dragevents();
		x.append(ul);


		$("#attr-grupos>ul").append(x);

		$(ul).sortable({
			connectWith: ".sortable-group-list > ul",
			dropOnEmpty: true,
			forceHelperSize: true,
			forcePlaceholderSize: true
		}).disableSelection();
	});

	$(document).on("click", ".rearrange-button", function () {
		var ul = $(".data-list-li-holder").parent();
		$(".remove-list-item").toggleClass("icon-reorganizar");
		$(".icon-reorganizar").toggleClass("remove-list-item");
		$(".data-list-li-holder ").toggleClass("data-list-li");
		$(".data-list-element-holder").toggleClass("data-list-element");
		if ($(".data-list-element-holder").hasClass("data-list-element")) {
			$(".data-list-element-holder").children().first().attr("contenteditable", "false");
		} else {
			$(".data-list-element-holder").children().first().attr("contenteditable", "true");
		}
	});
	$("#groups-ul").sortable({
		items: ".data-list-li-holder",
		handle: ".data-list-element"
	});
	$(document).on("click", ".label-dibujar-check", function () {
		if (!$('#dibujar-check').is(":checked")) {
			localStorage.drawLabels = true;
		} else {
			localStorage.drawLabels = false;
		}
	});
	$(document).on("click", ".label-dest-check", function () {
		if (!$('#destacar_check').is(":checked")) {
			localStorage.destacado_bars = true;
		} else {
			localStorage.destacado_bars = false;
		}
	});
	$(document).on("mousedown", ".data-list-li", function () {
		$(this).addClass("mousedown");
	});
	$(document).on("mouseup", ".data-list-li", function () {
		$(this).removeClass("mousedown");

	});

	$(document).on("click", ".remove-list-item", function () {
		$(this).parent().remove();
		_().saveStep();
	});
	$(document).on("click", ".label-separador-check", function () {
		if (!$('#separador-check').is(":checked")) {
			localStorage.separado = true;
		} else {
			localStorage.separado = false;
		}
	});

	$(document).on("click", "#dimensiones li", function () {
		$(".active_dimension").removeClass("active_dimension");
		$(this).addClass("active_dimension");
		switch ($(this).text()) {
		case "Cuadrado":
			localStorage.dimensiones = JSON.stringify({width: "cuadrado", height: "cuadrado"});
			break;
		case "Central":
			localStorage.dimensiones = JSON.stringify({width: "ancho", height: "cuadrado"});
			break;
		case "Alto Cuadrado":
			localStorage.dimensiones = JSON.stringify({width: "cuadrado", height: "alto"});
			break;
		case "Alto Central":
			localStorage.dimensiones = JSON.stringify({width: "ancho", height: "alto"});
			break;
		}

	});

	$(document).on("change", "#fileSelect", function (e) {
		var files = ($(this)[0].files), i, f, reader, name, data, wb, arr;
		for (i = 0, f = files[i]; i !== files.length; ++i) {
			reader = new FileReader();
			name = f.name;
			reader.onload = function (e) {
				data = e.target.result;
				if (typeof Worker !== 'undefined') {
					xlsxworker(data, process_wb);
				} else {
					if (rABS) {
						wb = XLSX.read(data, {type: 'binary'});
					} else {
						arr = String.fromCharCode.apply(null, new Uint8Array(data));
						wb = XLSX.read(btoa(arr), {type: 'base64'});
					}
					process_wb(wb);
				}
			};
			if (rABS) reader.readAsBinaryString(f);
			else reader.readAsArrayBuffer(f);
	}
	})
	dragevents();
	function restaurarColores(){
		colores = standard.slice(0);
		cargar(data,tipo);
	}
});
function undo() {
    _().undoAction();
}


function console_welcome() {
    console.log("  _______ .______          ___      .______    __    __       ___      .______   .______   ");
    console.log(" /  _____||   _  \\        /   \\     |   _  \\  |  |  |  |     /   \\     |   _  \\  |   _  \\  ");
    console.log("|  |  __  |  |_)  |      /  ^  \\    |  |_)  | |  |__|  |    /  ^  \\    |  |_)  | |  |_)  | ");
    console.log("|  | |_ | |      /      /  /_\\  \\   |   ___/  |   __   |   /  /_\\  \\   |   ___/  |   ___/  ");
    console.log("|  |__| | |  |\\  \\----./  _____  \\  |  |      |  |  |  |  /  _____  \\  |  |      |  |      ");
    console.log(" \\______| | _| \\`.____/__/     \\__\\ | _|      |__|  |__| /__/     \\__\\ | _|      | _|      ");
    console.log("                                                                                           ");
}
