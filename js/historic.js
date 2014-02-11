var historic = 1;
"use strict";
var fuente_value = "Cores";
if (localStorage.fuente) {
    fuente_value = localStorage.fuente;
}else{
    fuente_value = "Cores";
}
var unidad_value = "Miles de t";
if (localStorage.unidad) {
    unidad_value = localStorage.unidad;
}
var delim;
if(localStorage.leyenda)
    delim = localStorage.leyenda;
else
    delim = "Leyenda";
_.prototype.history= function (obj) {
    var id = this.id;
    _().canvas( this.e[0], function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.data = obj.data;

        this.printLabels = true;
        if ( localStorage.drawLabels ) {
            this.printLabels = localStorage.drawLabels;
        }
        this.separado = false;
        if ( localStorage.separado ) {
            this.separado = localStorage.separado;
            if (localStorage.separador_title){
                this.separador_title = localStorage.separador_title;
            } else {
                this.separador_title = "Separador";
            }
            if (localStorage.separacionList){
                this.listaSeparador = JSON.parse(localStorage.separacionList);
            } else {
                this.listaSeparador = [100,100,100,100,100,400,400,400,400,400,400,400];
            }
        }
        this.colores_grupos = [];

        for (var j = 1; j < Object.keys(this.data[0]).length; j++) {
            var grupo = Object.keys(this.data[0])[j];
            var tmp = {
                grupo: grupo,
                color: colores_barras[(j-1)%colores_barras.length].hex};
            this.colores_grupos.push(tmp);
        }


        if (!localStorage.coloresBarras) {
            localStorage.coloresBarras = JSON.stringify(this.colores_grupos);
        } else {
            this.colores_grupos = JSON.parse(localStorage.coloresBarras);
        }


        this.addHistTools(obj.data);
        this.drawHist(this.canvas, obj.data);
    });
}

_.prototype.getMaxValue = function () {
    var max = 0;
    for (var i = 0; i < this.data.length; i++ ) {
        for (var j = 1; j < Object.keys(this.data[0]).length; j++) {
            if ( this.data[i][Object.keys(this.data[i])[j]] > max ) {
             max = this.data[i][Object.keys(this.data[i])[j]];
            }
        }
    }

    var len = max.toString().split(".")[0].length;
    var orden = Math.pow(10, len - 1);
    var next = parseInt(max/orden) + 1;
    var max = next * orden;
    return max;
}

_.prototype.historyPannel = function() {
    var data = this.data;

    var f = document.createDocumentFragment();
    var div_container = document.createElement("DIV");
        div_container.setAttribute("id","data-container");
    var div_data = document.createElement("DIV");
        div_data.className = "data-options";
    var div_options = document.createElement("DIV");
        div_options.className = "data-options";
        div_options.setAttribute("id","options-bars");

    var fuente_label = document.createElement("DIV");
        fuente_label.innerHTML = "<span>Fuente: </span>";

    var fuente_inpt = document.createElement("INPUT");
        fuente_inpt.type = "text";
        fuente_inpt.setAttribute("id","fuente_input");
        fuente_inpt.setAttribute("value",fuente_value);

    var unidades_label = document.createElement("DIV");
        unidades_label.innerHTML = "<span>Unidad: </span>";

    var unidades_inpt = document.createElement("INPUT");
        unidades_inpt.type = "text";
        unidades_inpt.setAttribute("id","unidades_input");
        unidades_inpt.setAttribute("value",unidad_value);

    fuente_label.appendChild(fuente_inpt);
    unidades_label.appendChild(unidades_inpt);
    div_options.appendChild(fuente_label);
    div_options.appendChild(unidades_label);

    var div_fila1 = document.createElement("DIV");
    var div_fila2 = document.createElement("DIV");
    var checkbox_labels = document.createElement("input");
        checkbox_labels.type = "checkbox";
        checkbox_labels.setAttribute("id","dibujar-check");
    var checkbox_title = document.createElement("label");
        checkbox_title.setAttribute("for","dibujar-check");
        checkbox_title.setAttribute("class","label-dibujar-check");
        checkbox_title.innerHTML = "Dibujar Etiquetas";
        checkbox_labels.checked = false;
    if (this.printLabels === "true") {
        checkbox_labels.checked = true;
    }

    div_fila1.appendChild(checkbox_labels);
    div_fila1.appendChild(checkbox_title);

    var separador_label = document.createElement("input");
        separador_label.type = "checkbox";
        separador_label.setAttribute("id","separador-check");
    var separador_title = document.createElement("label");
        separador_title.setAttribute("for","separador-check");
        separador_title.setAttribute("class","label-separador-check");
        separador_title.innerHTML = "Dibujar separador";
        separador_label.checked = false;
    div_fila2.appendChild(separador_label);
    div_fila2.appendChild(separador_title);

    $(checkbox_labels).on("change",{separado: this.separado, lista: ""},this.draw_history_func);
    $(separador_label).on("change",{separado: this.separado, lista: ""},this.draw_history_func);

    div_options.appendChild(div_fila1);
    div_options.appendChild(div_fila2);
    if (this.separado === "true") {
        var div_separador = document.createElement("div");
        var ul_separador = document.createElement("ul");
        ul_separador.setAttribute("id","separador_ul");
        separador_label.checked = true;
        var separador_text = document.createElement("div");
            separador_text.innerHTML = this.separador_title;
            separador_text.setAttribute("id","separador_text");
            separador_text.setAttribute("contenteditable","true");
        for (var i = 0; i < data.length; i++) {
            var separador_num = document.createElement("li");
            separador_num.className = "data-list-separador";
            separador_num.setAttribute("contenteditable","true");
            if(!localStorage.separacionList)
                separador_num.innerHTML = 0;
            else
                separador_num.innerHTML = this.listaSeparador[i];
            ul_separador.appendChild(separador_num);
        }
        div_separador.appendChild(separador_text);
        div_separador.appendChild(ul_separador);
        div_container.appendChild(div_separador);
    }


    var ul = document.createElement("UL");
    ul.setAttribute("id","groups-ul");

    for (var j = 0; j < Object.keys(data[0]).length; j++) {
        var li1 = document.createElement("li");

        var div = document.createElement("DIV");
        if (Object.keys(data[0])[j] != delim)
            div.className = "data-list-element-holder";
        div.innerHTML = "<div contenteditable='true'>" + Object.keys(data[0])[j] + "</div>";

        if (Object.keys(data[0])[j] != delim) {

    //        var colorinpt = document.createElement("input");
      //          colorinpt.setAttribute("type","color");
            if(j>0) {
                clinpt(div).input(this.colores_grupos[(j-1)%this.colores_grupos.length]["color"]);
            }
//                colorinpt.value = this.colores_grupos[(j-1)%this.colores_grupos.length]["color"];
  //          div.appendChild(colorinpt);
        }


        if (j > 0) {
            $(li1).append("<div class='remove-list-item'></div>");
            li1.className = "data-list-li-holder";
        }
        else {
            $(li1).append("<div></div>");
            li1.className = "data-list-li-year";
        }
        li1.appendChild(div);
        var set = document.createElement("ul");
        for (var i = 0; i < data.length; i++) {
            var li = document.createElement("LI");
            var cont = document.createElement("DIV");
                cont.setAttribute("contenteditable","true");
                cont.innerHTML = data[i][Object.keys(data[i])[j]];
            li.appendChild(cont);
            set.appendChild(li);
        }
        li1.appendChild(set);
        ul.appendChild(li1);
    }
    var separado = this.separado;
    if(this.separado == "true") var lista = this.listaSeparador;
    var inpt_dib = document.createElement("BUTTON");
        inpt_dib.innerHTML = "Dibujar<div class='icon-pencil icono'></div> ";
        inpt_dib.className = "draw_button";
        $(inpt_dib).on("click",{separado: this.separado, lista:lista},this.draw_history_func);

    var inpt_activar = document.createElement("BUTTON");
        inpt_activar.innerHTML = "Reordenar<div class='icon-rearrange icono'></div> ";
        inpt_activar.className = "rearrange-button";

    div_data.appendChild(ul);

    div_container.appendChild(div_data);

    div_container.appendChild(div_options);


    f.appendChild(div_container);
    f.appendChild(div_container);
    f.appendChild(inpt_dib);
    f.appendChild(inpt_activar);

    return f;
}

_.prototype.history_type_menu = function() {
    var dest = Array.prototype.slice.call(this.e);

    var normalGrahp = document.createElement("LI");
        normalGrahp.innerHTML ="Gráfico histórico<div class='icon-stats icono' title='Gráfico historico'></div>";
        normalGrahp.setAttribute("id","pie_simple");
        normalGrahp.setAttribute("tipo","Histórico");

    var areaGrahp = document.createElement("LI");
        areaGrahp.innerHTML ="Gráfico áreas<div class='icon-areas icono' title='Gráfico areas'></div>";
        areaGrahp.setAttribute("id","pie_complex");
        areaGrahp.setAttribute("tipo","Área");

    (dest).forEach( function(t){
        t.innerHTML = "";
        t.appendChild(normalGrahp);
        t.appendChild(areaGrahp);
    });
    return this;
}
_.prototype.addHistTools = function(data) {
    //  Left Menu
    var menu = document.querySelectorAll("menu")[0];
        menu.innerHTML = "";

    var normalGrahp = document.createElement("DIV");
        normalGrahp.innerHTML ="<div class='icon-stats icono' title='Gráfico historico'></div><span class='menu-text'>Gráfico histórico</span>";
        if(pie_mode == "simple")normalGrahp.className = "active menu-button";
        else normalGrahp.className = "menu-button";
        normalGrahp.setAttribute("id","pie_simple");
        menu.appendChild(normalGrahp);

    var areaGrahp = document.createElement("DIV");
        areaGrahp.innerHTML ="<div class='icon-areas icono' title='Gráfico areas'></div><span class='menu-text'>Gráfico áreas</span>";
        if(pie_mode == "complex")areaGrahp.className = "active menu-button";
        else areaGrahp.className = "menu-button";
        areaGrahp.setAttribute("id","pie_complex");
        menu.appendChild(areaGrahp);

    //  Under Graph data
    var data_content = document.querySelectorAll("#graph-data")[0];
        data_content.innerHTML =  "";
        data_content.appendChild(this.historyPannel());
     $("#groups-ul").sortable({
        items: ".data-list-li-holder",
        handle: ".data-list-element"
    });
}

_.prototype.drawHist = function (canvas, data) {
    this.ctx = canvas.getContext("2d");
    this.data = data;
    var maximo = this.getMaxValue();
    var posicion = this.createBarsVerticalAxis(maximo,5,"historico");
    this.drawHistoricBars(posicion);
    clinpt().loadFunctions();
}


_.prototype.drawHistoricBars = function (posicion) {
    var w = this.ctx.canvas.width - 30;
    var h = this.ctx.canvas.height - 20;
    var x = w / this.data.length;
    var data = this.data;
    var a = -x;
    var maximo = this.getMaxValue();
    var min = this.getMinValue();
    var amplitud = maximo - min;

    var puntos = [];
    var offset = (posicion["step"] * posicion["numero"]) * h / maximo;
    var des_orig = (posicion["origen"] < 0) ? posicion["origen"] : 0;
    this.step = this.getStep(maximo, 5);

    for ( var j = 0; j < Object.keys(data[0]).length; j++ ) {
        if(Object.keys(data[0])[j] != delim){
            linea_set = [];
            a = -x;
            if(pie_mode != "simple") linea_set.push({x:0,y:0});
            for ( var i=0; i < data.length; i++ ) {
                //var value = ((((data[i][Object.keys(data[0])[j]]-min) * h)/amplitud));
                var value =  ((data[i][Object.keys(data[0])[j]]-this.origen)/this.step.label)*this.step.val;
                linea_set.push({x:a + x, y: -( value)});
                a += x;
            }
            if(pie_mode != "simple") linea_set.push({ x:a, y:0 });
            puntos.push(linea_set);
        }
    };

    var layer_hist = new Kinetic.Layer();
    var colores = this.colores_grupos;

    for ( var i = 0; i < puntos.length;i++ ) {
        if(pie_mode == "simple") {
            var line = new Kinetic.Line({
                points: puntos[i],
                stroke: colores[i%colores.length]["color"],
                strokeWidth: 3,
                lineCap: 'round',
                lineJoin: 'round',
            });


        } else {
            var line = new Kinetic.Polygon({
                points: puntos[i],
                fill: colores[i%colores.length]["color"],
                stroke: "white",
                strokeWidth: 1,
            });
        }

        line.move(40, h);
        if (this.printLabels === "true") {
            var text = Object.keys(data[0])[i+1];
            var width = this.ctx.measureText(text).width;
            this.drawLabel(30 + puntos[i][1]["x"],
                           h + puntos[i][1]["y"] - 5,
                           24,
                           colores_barras[i%colores_barras.length].hex,
                           "#FFFFFF",
                           text, 4, layer_hist);
        }
        layer_hist.add(line);
    }

    if(this.separado == "true") {
        var separador_puntos = [];
        a = -x;
        for(var i = 0; i < this.listaSeparador.length; i++) {
            var value =  ((this.listaSeparador[i]-this.origen)/this.step.label)*this.step.val;
            separador_puntos.push({x:a + x, y: -( value)});
            a += x;
        }
        var separador = new Kinetic.Line({
            points: separador_puntos,
            stroke: 'white',
            strokeWidth: 2,
        });
        separador.move(40,h);
        layer_hist.add(separador);
    }
    for ( var j = 0; j < data.length; j++ ) {
        var x_var;
        if(pie_mode == "simple") { x_var = 35 + puntos[0][j]["x"];}
        else {x_var = 35 + puntos[0][j+1]["x"] - (this.ctx.measureText(this.data[j][delim]).width/2);}

        var year = new Kinetic.Text({
            x: x_var,
            y: h,
            fontSize: 12,
            fontFamily: 'Mic 32 New Rounded,mic32newrd,Helvetica,Arial',
            text: this.data[j][delim],
            fill: "black",
            padding: 1,
        });
        layer_hist.add(year);
    }
    if (this.printLabels === "true") {
        if(this.separado == "true") {
                var text = this.separador_title;
                var width = this.ctx.measureText(text).width;
                this.drawLabel(60 ,
                           h-((((this.listaSeparador[0]-min) * h)/amplitud)) - 10,
                           24,
                           "black",
                           "#FFFFFF",
                           text, 4, layer_hist);
            }
        var labels = layer_hist.find('.label');
        labels.forEach(function(i){
            i.setZIndex(50);
        });
    }

    this.stage.add(layer_hist);
    layer_hist.draw();
}
_.prototype.draw_history_func = function(d){
    var separado = d.data["separado"];
    var lista = d.data["lista"];
    var fuent = document.querySelectorAll("#fuente_input")[0].value;
    localStorage.fuente = fuent;
    fuente_value = fuent;

    var unit = document.querySelectorAll("#unidades_input")[0].value;
    localStorage.unidad = unit;
    unidad_value = unit;

    if(separado== "true"){
        var sepDiv = document.querySelectorAll(".data-list-separador");
        _().each(sepDiv,function(i,a) {
            lista[i] = a[i].innerHTML;
        });
        localStorage.separacionList = JSON.stringify(lista);
        var titulo_separador= document.querySelector("#separador_text").innerHTML;
        localStorage.separador_title = titulo_separador;
    }

    var valores = [];
    var order = [];
    var datos = document.querySelectorAll("#groups-ul>li");

    for (var i = 0; i < datos[0].children[2].children.length; i++) valores.push(new Object);


    _().each(datos,function(i){
        var title = datos[i].children[1].children[0].innerHTML;

        order.push(title);

        _().each( datos[i].children[2].children,function(j,a){

            var value = a[j].children[0].innerHTML;
            valores[j][title] =parseFloat( value);
        });

        _().each( datos[i].children[2].children,function(j,a){
            var value = a[j].children[0].innerHTML;
            valores[j][title] = value;
        });
    });


    var tmp_colors = [];


    var colores = colores_barras;
    _().each(datos, function(i) {
        if(i>0) {
        if(datos[i].children[1].children.length > 1){
            var tmp = {
                grupo: datos[i].children[1].children[0].innerHTML,
                color: datos[i].children[1].children[1].children[0].value
            };
        }
        else{
            var tmp = {
                grupo: datos[i].children[1].children[0].innerHTML,
                color: colores[(i-1)%colores.length].hex,
            };
        }
        tmp_colors.push(tmp);

        var title = order[i];
        _().each( datos[i].children[2].children,function(j, a) {
            var value = parseFloat(a[j].children[0].innerHTML);
            valores[j][title] = value;
        });
        _().each( datos[i].children[2].children,function(j, a) {
            var value = parseFloat(a[j].children[0].innerHTML);
            valores[j][title] = value;
        });
        }
    });

    localStorage.coloresBarras = JSON.stringify(tmp_colors);
    localStorage.data = JSON.stringify(valores);
    _().saveStep();
    _("#graph").history({data:valores});
}
