var historic = 1;
"use strict";

_.prototype.history= function (obj) {
    var id = this.id;
    _().canvas( this.e[0], function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.printLabels = true;
        if ( localStorage.drawLabels ) {
            this.printLabels = localStorage.drawLabels;
        }
        this.data = obj.data;
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

        div_options.appendChild(checkbox_labels);
        div_options.appendChild(checkbox_title);
    var ul = document.createElement("UL");
    $(ul).droppable({
        addClasses : false,
        accept: ".data-list-li",
        drop: function (e, ui) {
            $(this).append(ui.draggable);
        }
    });
    ul.setAttribute("id","groups-ul");

    for (var j = 0; j < Object.keys(data[0]).length; j++) {
        var li1 = document.createElement("li");
        var div = document.createElement("DIV");
        if (Object.keys(data[0])[j] != "Leyenda") div.className = "data-list-element-holder";
            div.innerHTML = "<div contenteditable='true'>" + Object.keys(data[0])[j] + "</div>";
        if (Object.keys(data[0])[j] != "Leyenda") {
            var colorinpt = document.createElement("input");
                colorinpt.setAttribute("type","color");
                colorinpt.value = colores_barras[j].hex;
            div.appendChild(colorinpt);
        }

        li1.appendChild(div);
        if (j > 0) li1.className = "data-list-li-holder";
        else li1.className = "data-list-li-year";

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
    var inpt_dib = document.createElement("BUTTON");
        inpt_dib.innerHTML = "Dibujar<div class='icon-pencil icono'></div> ";
        inpt_dib.className = "draw_button";
        inpt_dib.addEventListener("click",function(){
            _("#graph").history({data:data});
        });
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
        areaGrahp.innerHTML ="<div class='icon-stats icono' title='Gráfico areas'></div><span class='menu-text'>Gráfico áreas</span>";
        if(pie_mode == "complex")areaGrahp.className = "active menu-button";
        else areaGrahp.className = "menu-button";
        areaGrahp.setAttribute("id","pie_complex");
        menu.appendChild(areaGrahp);


    //  Under Graph data
    var data_content = document.querySelectorAll("#graph-data")[0];
        data_content.innerHTML =  "";
        data_content.appendChild(this.historyPannel());

}

_.prototype.drawHist = function (canvas, data) {
    this.ctx = canvas.getContext("2d");
    this.data = data;
    var maximo = this.getMaxValue();
    var posicion = this.createBarsVerticalAxis(maximo,5,"historico");
    this.drawHistoricBars(posicion);
}


_.prototype.drawHistoricBars = function (posicion) {
    var w = this.ctx.canvas.width - 20;
    var h = this.ctx.canvas.height - 20;
    var x = w / this.data.length;
    var data = this.data;
    var a = -x;
    var maximo = this.getMaxValue();
    var puntos = [];
    var offset = (posicion["step"] * posicion["numero"]) * h / maximo;
    var des_orig = (posicion["origen"] < 0) ? posicion["origen"] : 0;

    for ( var j = 1; j < Object.keys(data[0]).length; j++ ) {
        linea_set = [];
        a = -x;
        for ( var i=0; i < data.length; i++ ) {
            var value = (((data[i][Object.keys(data[0])[j]] - des_orig) * h) - offset)/(maximo);
            linea_set.push({x:a + x, y: -( value - offset )});
            a += x;
        }
        puntos.push(linea_set);
    };

    var layer_hist = new Kinetic.Layer();
    for ( var i = 0; i < puntos.length;i++ ) {
        var line = new Kinetic.Line({
            points: puntos[i],
            stroke: colores_barras[i].hex,
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
        });

        line.move(40, h);
        if (pie_mode === "simple" && this.printLabels === "true") {
            var text = Object.keys(data[0])[i+1];
            var width = this.ctx.measureText(text).width;
            this.drawLabel(30 + puntos[i][1]["x"],
                           h + puntos[i][1]["y"] - 5,
                           width + 4, 24,
                           colores_barras[i].hex,
                           "#FFFFFF",
                           text, 4, layer_hist);
        }
        layer_hist.add(line);
    }
    if (pie_mode == "simple" && this.printLabels === "true") {
        var labels = layer_hist.find('.label');
        labels.forEach(function(i){
            i.setZIndex(50);
        });
    }

    for ( var j = 0; j < data.length; j++ ) {
        var year = new Kinetic.Text({
            x: 35 + puntos[0][j]["x"],
            y: h,
            fontSize: 12,
            fontFamily: 'Mic 32 New Rounded',
            text: this.data[j]["Leyenda"],
            fill: "black",
            padding: 1,
        });
        layer_hist.add(year);
    }

    this.stage.add(layer_hist);
    layer_hist.draw();
}