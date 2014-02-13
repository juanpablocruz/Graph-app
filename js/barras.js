"use strict";

var barras = 1;
var fuente_value = "Cores";
if (localStorage.fuente) {
    fuente_value = localStorage.fuente;
}
var unidad_value = "Miles de t";
if (localStorage.unidad) {
    unidad_value = localStorage.unidad;
}
var barras_mode = "compuesto";
if (localStorage.barras_mode) {
    barras_mode = localStorage.barras_mode;
}
_.prototype.bars = function (obj) {
    var id = this.id;
    _().canvas(this.e[0],function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.printLabels = true;

        if(localStorage.drawLabels){
            this.printLabels = localStorage.drawLabels;
        }

        this.destacado = false;
        if(localStorage.destacado_bars){
            this.destacado = localStorage.destacado_bars;
        } else {
            localStorage.destacado_bars = this.destacado;
        }

        this.data = obj.data;
        this.colores_grupos = [];
        var start_point = 0, color_point = 0;

        //FIXME: [x]Mostrar etiquetas reinicia los cambios no guardados

        for (var j = 0; j < Object.keys(this.data[0]).length; j++) {
            var grupo = Object.keys(this.data[0])[j];
            if( barras_mode == "compuesto")
                 grupo = this.data[0][Object.keys(this.data[0])[j]];
            var tmp = {
                grupo: grupo,
                color: colores_barras[j%colores_barras.length].hex};
            this.colores_grupos.push(tmp);
        }

        if (!localStorage.coloresBarras) {
            localStorage.coloresBarras = JSON.stringify(this.colores_grupos);
        } else {
            this.colores_grupos = JSON.parse(localStorage.coloresBarras);
        }
        this.addBarTools(obj.data);
        this.drawBar(this.canvas,obj.data);
        $("#groups-ul").sortable({
            items: ".data-list-li-holder",
            handle: ".data-list-element"
        });
    });
}

_.prototype.bars_type_menu = function() {
    var dest = Array.prototype.slice.call(this.e);
    var compuestoGrahp = document.createElement("LI");
        compuestoGrahp.innerHTML ="Gráfico Compuesto<div class='icon-bars2 icono' >";
        compuestoGrahp.setAttribute("id","bars_compuesto");
        compuestoGrahp.setAttribute("tipo","Compuesto");


    var colsGrahp = document.createElement("LI");
        colsGrahp.innerHTML ="Gráfico Columnas<div class='icon-bars icono'></div>";
        colsGrahp.setAttribute("id","bars_cols");
        colsGrahp.setAttribute("tipo","Columnas");

    (dest).forEach( function(t){
        t.innerHTML = "";
        t.appendChild(compuestoGrahp);
        t.appendChild(colsGrahp);
    });
    return this;

}

_.prototype.addBarTools = function(data){
    //  Left Menu
    var menu = document.querySelectorAll("menu")[0];
        menu.innerHTML = "";

    //  Under Graph data
    var data_content = document.querySelectorAll("#graph-data")[0];
        data_content.innerHTML = "";

    var f = document.createDocumentFragment();
    var div_container = document.createElement("DIV");
        div_container.setAttribute("id","data-container");

    var div_data = document.createElement("DIV");
        div_data.className = "data-options";

    var div_options = document.createElement("DIV");
        div_options.className = "data-options";
        div_options.setAttribute("id","options-bars");
    if (barras_mode != "cols") {
    var checkbox_labels = document.createElement("input");
        checkbox_labels.type = "checkbox";
        checkbox_labels.setAttribute("id","dibujar-check");

    var checkbox_title = document.createElement("label");
        checkbox_title.setAttribute("for","dibujar-check");
        checkbox_title.setAttribute("class","label-dibujar-check");
        checkbox_title.innerHTML = "Dibujar Etiquetas";
        checkbox_labels.checked = false;

    if(this.printLabels === "true") {
        checkbox_labels.checked = true;
    }

    $(checkbox_labels).on("change",{destc:this.destacado},this.draw_bars_func);
    //checkbox_labels.addEventListener("change",this.draw_bars_func,this.destacado);
    var check_div = document.createElement("DIV");
    }


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
        unidades_inpt.setAttribute("value", unidad_value);

    fuente_label.appendChild(fuente_inpt);
    unidades_label.appendChild(unidades_inpt);
    div_options.appendChild(fuente_label);
    div_options.appendChild(unidades_label);

    if (barras_mode != "cols") {
        var dest_div = document.createElement("DIV");
        var destaca_labels = document.createElement("input");
            destaca_labels.type = "checkbox";
            destaca_labels.setAttribute("id","destacar_check");
        var destaca_title = document.createElement("label");
            destaca_title.setAttribute("for","destacar_check");
            destaca_title.setAttribute("class","label-dest-check");
            destaca_title.innerHTML = "Destacar Sección";
            destaca_title.checked = false;
        if(this.destacado === "true") {
            destaca_labels.checked = true;
        }
        dest_div.appendChild(destaca_labels);
        dest_div.appendChild(destaca_title);
        div_options.appendChild(dest_div);
        $(destaca_labels).on("change",{destc:this.destacado},this.draw_bars_func);
        //destaca_labels.addEventListener("change",this.draw_bars_func,this.destacado);

        check_div.appendChild(checkbox_labels);
        check_div.appendChild(checkbox_title);
        div_options.appendChild(check_div);
    }



    var ul = document.createElement("UL");

    ul.setAttribute("id","groups-ul");
    var orden = Object.keys(data[0]);
    if(localStorage.ordenacion)
        orden = JSON.parse(localStorage.ordenacion);
    for (var j=0; j < orden.length; j++) {
        var li1 = document.createElement("li");
        var div = document.createElement("DIV");
        if (barras_mode == "cols" || j > 0) div.className = "data-list-element-holder";
            div.innerHTML = "<div contenteditable='true'>"+orden[j]+"</div>";
        if(j>0) {
            clinpt(div).input(this.colores_grupos[j-1]["color"]);
        }

        if (barras_mode == "cols" || j > 0) {
            $(li1).append("<div class='remove-list-item'></div>");
            li1.className = "data-list-li-holder";
        }
        else {
            $(li1).append("<div></div>");
            li1.className = "data-list-li-year";
        }
        li1.appendChild(div);
        var set = document.createElement("ul");

        for (var i=0;i< data.length;i++) {
            var li = document.createElement("LI");
            var cont = document.createElement("DIV");
                cont.setAttribute("contenteditable","true");
                cont.innerHTML =data[i][orden[j]];
            li.appendChild(cont);
            set.appendChild(li);
        }

        li1.appendChild(set);
        ul.appendChild(li1);
    }

    var inpt_dib = document.createElement("BUTTON");
        inpt_dib.innerHTML = "Dibujar<div class='icon-pencil icono'></div> ";
        inpt_dib.className = "draw_button";

        $(inpt_dib).on("click",{destc:this.destacado},this.draw_bars_func);

    var inpt_activar = document.createElement("BUTTON");
        inpt_activar.innerHTML = "Reordenar<div class='icon-rearrange icono'></div> ";
        inpt_activar.className = "rearrange-button";

    div_data.appendChild(ul);

    div_container.appendChild(div_data);
    div_container.appendChild(div_options);
    f.appendChild(div_container);
    f.appendChild(inpt_dib);
    f.appendChild(inpt_activar);
    data_content.appendChild(f);
}

_.prototype.drawBar = function(canvas,data){
    this.ctx = canvas.getContext("2d");
    this.data = data;
    var maximo = this.getMaxColumn();

    this.createBarsVerticalAxis(maximo,6,"barras");
    this.createBarsHorizontalAxis(maximo);
    clinpt().loadFunctions();
}
_.prototype.getMaxColumn = function (){
    var max = 0;
    if(barras_mode != "cols") {
        for(var i=0;i< this.data.length;i++){
        var tmp = 0;
        for (var j = 1; j < Object.keys(this.data[0]).length; j++) {
            if(!isNaN(this.data[i][Object.keys(this.data[i])[j]]))
            tmp += this.data[i][Object.keys(this.data[i])[j]];
        }
        if (tmp > max) {
             max = tmp;
        }
    }
    } else {

        for(var i=0;i< Object.keys(this.data[0]).length;i++){
            var tmp = 0;
            for (var j = 0; j < this.data.length; j++) {
                if(!isNaN(this.data[j][Object.keys(this.data[j])[i]]))
                tmp += this.data[j][Object.keys(this.data[j])[i]];
            }
            if (tmp > max) {
                 max = tmp;
            }
        }
    }
    var len = Math.round(max).toString().length;
    var orden = Math.pow(10,len-1);
    var next = parseInt(max/orden)+1;
    var max = next * orden;

    return max;
}

_.prototype.drawBarra = function(maximo, i, j, h, height, layer, wBar, m, orden, color_rest, offset){
    if((i>0 || barras_mode == "cols")&&!isNaN(this.data[j][orden[i]])) {
        if(barras_mode != "cols") {
            color_rest = 1;
            var value = (((this.data[j][orden[i]] * 100) / this.ceil)*h/100);
        } else {
            color_rest = 0;

            var value = (((this.data[j][orden[i]] * 100) / maximo)*h/100);
        }
        var colores = (this.destacado == "true") ? colores_alpha[(i-color_rest)%colores_alpha.length].hex : this.colores_grupos[(i-color_rest)%this.colores_grupos.length]["color"];
        var barra = new Kinetic.Shape({
            drawFunc: function(ctx){
                ctx.beginPath();
                ctx.rect(30 + ((wBar + m) * (j+offset)), height, wBar, -value);
                ctx.closePath();
                ctx.fillStrokeShape(this);
            },
            stroke: "rgba(0,0,0,0)",
            strokeWidth: 0,
            fill: colores,
        });
        layer.add(barra);
    }
}

_.prototype.createBarsHorizontalAxis = function(max){
    var w = this.ctx.canvas.width - 30;
    var h = this.ctx.canvas.height - 30;
    if(barras_mode == "compuesto")
        var N = this.data.length;
    else
        var N = Object.keys(this.data[0]).length;
    var m = 10;
    if (N < 4) m = m * ((1 / ((N * 100) / 6))) * 100;
    var wBar = (w - (N * m) - 20) / N;

    var maximo = max;
    var layer2 = new Kinetic.Layer();
    var height_accumulated = 0;
    var labels = [];
     if(!localStorage.ordenacion && barras_mode == "compuesto"){
        var orden = Object.keys(this.data[0]);
         var start = 0;
         var color_rest = 0;
    } else if(!localStorage.ordenacion && barras_mode == "cols"){
        var orden = Object.keys(this.data[0]);
        var start = 0;
         var color_rest = 0;
    } else {
        var orden = JSON.parse(localStorage.ordenacion);
        var start = 0;
         var color_rest = 0;
    }
    var drawn = false;
    for (var j=0; j<this.data.length; j++){
        var leyenda = "";
        for (var i = start; i< orden.length; i++){
            switch (barras_mode) {
                case "compuesto":

                    this.drawBarra(maximo,
                           i, j, h,
                           this.ctx.canvas.height-20-height_accumulated,
                           layer2,wBar,m,orden,color_rest,0);
                    if(labels.indexOf(i)==-1 && this.printLabels === "true" ){
                        if((this.destacado == "true" && i > 1) || (this.destacado != "true" && i > 0)) {

                        labels.push(i);
                        var texto = orden[i];
                        var lwidth =  this.ctx.measureText(texto).width;
                        this.drawLabel(50,this.ctx.canvas.height-40-height_accumulated,20,
                                       "#333","white",texto,1,layer2);
                        }
                    }
                    if(!isNaN(this.data[j][orden[i]]))
                    height_accumulated+=(((this.data[j][orden[i]] * 100) / (this.ceil))*h/100);
                    break;
                case "cols":
                    this.drawBarra(maximo,
                           i, j, h,
                           this.ctx.canvas.height-20,
                           layer2,wBar,m,orden,color_rest,i);
                    if(!drawn){
                    leyenda = Object.keys(this.data[0])[i];
                    var year = new Kinetic.Text({
                        x: 40+(j+i)*(wBar+m) - (this.ctx.measureText(leyenda).width/2),
                        y: this.ctx.canvas.height-20,
                        fontSize: 12,
                        fontFamily: "Mic 32 New Rounded,mic32newrd,Helvetica,Arial",
                        text: leyenda,
                        fill: "black",
                        padding: 1,
                    });
                    layer2.add(year);
                    break;
                    }
            }

        }
        drawn = true;
        if(barras_mode == "compuesto") {
            leyenda = this.data[j][Object.keys(this.data[0])[0]];

            var year = new Kinetic.Text({
                x: 45+(j+0)*(wBar+m) - (this.ctx.measureText(leyenda).width/2),
                y: this.ctx.canvas.height-20,
                fontSize: 12,
                fontFamily: "Mic 32 New Rounded,mic32newrd,Helvetica,Arial",
                text: leyenda,
                fill: "black",
                padding: 1,
            });
            layer2.add(year);
        }
        height_accumulated=0;
    }
    var labels = layer2.find('.label');
    labels.forEach(function(i){
        i.setZIndex(50);
    });
    this.stage.add(layer2);
    layer2.draw();

}

_.prototype.draw_bars_func = function(d){
    /* FETCH LABELS */
    var destc = d.data["destc"];
    var valores = [];
    var order = [];
    var datos = document.querySelectorAll("#groups-ul>li");

    for (var i = 0; i < datos[0].children[2].children.length; i++) valores.push(new Object);

    _().each(datos,function(i){
        var title = datos[i].children[1].children[0].innerHTML;

        order.push(title);

        _().each( datos[i].children[2].children,function(j,a){

            var value = a[j].children[0].innerHTML;
            valores[j][title] =parseInt( value);
        });

        _().each( datos[i].children[2].children,function(j,a){
            var value = a[j].children[0].innerHTML;
            valores[j][title] = value;
        });
    });

    /* FETCH VALUES */
    var fuent = document.querySelectorAll("#fuente_input")[0].value;
    localStorage.fuente = fuent;
    fuente_value = fuent;
    var unit = document.querySelectorAll("#unidades_input")[0].value;
    localStorage.unidad = unit;
    unidad_value = unit;
    var tmp_colors = [];

    var colores = (destc == "true") ? colores_alpha : colores_barras;


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
                color: colores[(i)%(colores.length)].hex,
            };
        }
        tmp_colors.push(tmp);
        }
        var title = order[i];
        _().each( datos[i].children[2].children,function(j, a) {
            var value = parseFloat(a[j].children[0].innerHTML);
            valores[j][title] = value;
        });

    });
    localStorage.coloresBarras = JSON.stringify(tmp_colors);
    localStorage.data = JSON.stringify(valores);
    localStorage.ordenacion = JSON.stringify(order);
    _().saveStep();
    _("#graph").bars({data:valores});
}
