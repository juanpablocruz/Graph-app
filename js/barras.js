var barras = 1;
"use strict";
var fuente_value = "Cores";
if (localStorage.fuente) {
    fuente_value = localStorage.fuente;
}


_.prototype.bars= function (obj) {
    var id = this.id;
    _().canvas(this.e[0],function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.printLabels = true;
        if(localStorage.drawLabels){
            this.printLabels = localStorage.drawLabels;
        }

        this.data = obj.data;
        this.colores_grupos = [];
        for (var j = 1; j < Object.keys(this.data[0]).length; j++) {
            var tmp = {
                grupo: this.data[0][Object.keys(this.data[0])[j]],
                color: colores_barras[j-1].hex};
            this.colores_grupos.push(tmp);
        }

        if (!localStorage.coloresBarras) {
            localStorage.coloresBarras = JSON.stringify(this.colores_grupos);
        } else {
            this.colores_grupos = JSON.parse(localStorage.coloresBarras);
        }
        this.addBarTools(obj.data);
        this.drawBar(this.canvas,obj.data);
    });
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
    var fuente_label = document.createElement("DIV");
        fuente_label.innerHTML = "<span>Fuente: </span>";
    var fuente_inpt = document.createElement("INPUT");
        fuente_inpt.type = "text";
        fuente_inpt.setAttribute("id","fuente_input");
        fuente_inpt.setAttribute("value",fuente_value);
    fuente_label.appendChild(fuente_inpt);
    div_options.appendChild(fuente_label);

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

    for (var j=0; j < Object.keys(data[0]).length; j++) {
        var li1 = document.createElement("li");
        var div = document.createElement("DIV");
            if (j > 0) div.className = "data-list-element-holder";
            div.innerHTML = "<div contenteditable='true'>"+Object.keys(data[0])[j]+"</div>";
        if (j > 0) {
            var colorinpt = document.createElement("input");
                colorinpt.setAttribute("type","color");
                colorinpt.value = this.colores_grupos[j-1]["color"];

            div.appendChild(colorinpt);
        }
        li1.appendChild(div);
        if (j > 0) li1.className = "data-list-li-holder";
        else li1.className = "data-list-li-year";

        var set = document.createElement("ul");
        for (var i=0;i< data.length;i++) {
            var li = document.createElement("LI");
            var cont = document.createElement("DIV");
                cont.setAttribute("contenteditable","true");
                cont.innerHTML =data[i][Object.keys(data[i])[j]];
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
            /* FETCH LABELS */
            var valores = [];
            var datos = document.querySelectorAll(".data-list-li-year");
            for (var i = 0; i < datos[0].children[1].children.length; i++) valores.push(new Object);
            _().each(datos,function(i){
                var title = datos[i].children[0].children[0].innerHTML;

                _().each( datos[i].children[1].children,function(j,a){
                    var value = a[j].children[0].innerHTML;
                    valores[j][title] =parseInt( value);
                });

                _().each( datos[i].children[1].children,function(j,a){
                    var value = a[j].children[0].innerHTML;
                    valores[j][title] = value;
                });
            });
            /* FETCH VALUES */
            var fuent = document.querySelectorAll("#fuente_input")[0].value;
            localStorage.fuente = fuent;
            fuente_value = fuent;
            var tmp_colors = [];
            var order = [];
            var datos = document.querySelectorAll(".data-list-li-holder");

            _().each(datos, function(i) {
                order.push(datos[i].children[0].children[0].innerHTML);
                console.log(datos[i].children[0].children[1].value);
                var tmp = {
                    grupo: datos[i].children[0].children[0].innerHTML,
                    color: datos[i].children[0].children[1].value
                };
                tmp_colors.push(tmp);
                var title = order[i];
                _().each( datos[i].children[1].children,function(j, a) {
                    var value = parseInt(a[j].children[0].innerHTML);
                    valores[j][title] = value;
                });
                _().each( datos[i].children[1].children,function(j, a) {
                    var value = parseInt(a[j].children[0].innerHTML);
                    valores[j][title] = value;
                });
            });
            localStorage.coloresBarras = JSON.stringify(tmp_colors);
            localStorage.data = JSON.stringify(valores);
            localStorage.ordenacion = JSON.stringify(order);
            _("#graph").bars({data:valores});
        });

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
}
_.prototype.getMaxColumn = function (){
    var max = 0;
    for(var i=0;i< this.data.length;i++){
        var tmp = 0;
        for (var j = 1; j < Object.keys(this.data[0]).length; j++) {
            tmp += this.data[i][Object.keys(this.data[i])[j]];
        }
        if (tmp > max) {
             max = tmp;
        }
    }
    var len = max.toString().length;
    var orden = Math.pow(10,len-1);
    var next = parseInt(max/orden)+1;
    var max = next * orden;
    return max;
}

_.prototype.getInterval = function (max,bars,origen) {
    return Math.ceil(max/(bars));
}

_.prototype.createBarsVerticalAxis = function(max,bars,type){
    var step = this.getInterval(max,bars,0);
    this.step = step;
    this.ceil = ((((max+step*2)/step)-2)*step);
    var ctx = this.ctx;

        var fuente = new Kinetic.Text({
            x: ctx.canvas.width - 15,
            y: ctx.canvas.height - 20 ,
            text: "Fuente: "+fuente_value,
            fontSize: 15,
            fontFamily: "InfoTextBook",
            fontStyle: "italic",
            fill: "#7B796C",
            rotationDeg: -90,
        });
    _.layer.add(fuente);

    var h = ctx.canvas.height-20;
    var posy = Math.floor((h)/(max/step));
    var contador = 0;
    ctx.font = "12px 'Mic 32 New Rounded'";
    //ctx.fillStyle = "#333";
    var oy=0;
    var text;
    var minimo = this.getMinValue(this.data);
    var origen = 0;
    var posicion = {bajo:false, step: step, numero: 0, origen: 0};
    if (type == "historico" && (minimo - 2 * step >= 0 || minimo < 0)) {
        posicion["bajo"] = true;
        posicion["numero"] = parseInt(minimo / step);
        posicion["origen"] = minimo;
        origen=minimo;
        step = this.getInterval(max,bars,origen);
    }
    var yaxis = new Kinetic.Shape({
        drawFunc: function(ctx) {
            for (var j = origen; j < max+step*2; j+= step) {
                var x = j.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                oy = h - (posy * contador);
                ctx.fillText(x, 0, oy - 5);
                ctx.beginPath();
                ctx.moveTo(0,oy);
                ctx.lineTo(ctx.canvas.width-20, oy);
                ctx.closePath();
                ctx.lineWidth = 1;
                ctx.stroke();
                contador++;
            };
        },
        id: "axis",
    });
    _.layer.add(yaxis);
    _.layer.draw();

    return posicion;
}

_.prototype.drawBarra = function(maximo, i, j, h, height, layer, wBar, m, orden, color_rest){
    var value = (((this.data[j][orden[i]] * 100) / (this.ceil))*h/100);
    var barra = new Kinetic.Shape({
        drawFunc: function(ctx){
            ctx.beginPath();
            ctx.rect(50 + ((wBar + m) * j), height, wBar, -value);
            ctx.closePath();
            ctx.fillStrokeShape(this);
        },
        stroke: "#FFF",
        strokeWidth: 1,
        fill: this.colores_grupos[i-color_rest]["color"],
    });
    layer.add(barra);
}

_.prototype.createBarsHorizontalAxis = function(max){
    var w = this.ctx.canvas.width-50;
    var h = this.ctx.canvas.height-30;
    var N = this.data.length;
    var m = 10;
    if(N<4)m = m*((1/((N*100)/6)))*100;
    var wBar = (w - (N*m) - 20)/N;
    var maximo = this.getMaxValue();
    var layer2 = new Kinetic.Layer();
    var height_accumulated = 0;
    var labels = [];
     if(!localStorage.ordenacion){
        var orden = Object.keys(this.data[0]);
         var start = 1;
         var color_rest = 1;
    } else {
        var orden = JSON.parse(localStorage.ordenacion);
        var start = 0;
         var color_rest = 0;
    }
    for (var j=0; j<this.data.length; j++){
        for (var i=start; i< orden.length; i++){

            this.drawBarra(maximo,
                           i, j, h,
                           this.ctx.canvas.height-20-height_accumulated,
                           layer2,wBar,m,orden,color_rest);
            if(labels.indexOf(i)==-1 && this.printLabels === "true"){
                labels.push(i);
                var texto = orden[i];
                var lwidth =  this.ctx.measureText(texto).width;
                this.drawLabel(50,this.ctx.canvas.height-40-height_accumulated,lwidth,20,
                               "#333","white",texto,1,layer2);
            }
            height_accumulated+=(((this.data[j][orden[i]] * 100) / (this.ceil))*h/100);
        }
        var year = new Kinetic.Text({
            x: 60+j*(wBar+m),
            y: this.ctx.canvas.height-20,
            fontSize: 12,
            fontFamily: 'Mic 32 New Rounded',
            text: this.data[j][Object.keys(this.data[0])[0]],
            fill: "black",
            padding: 1,
        });
        layer2.add(year);
        height_accumulated=0;
    }
    var labels = layer2.find('.label');
    labels.forEach(function(i){
        i.setZIndex(50);
    });
    this.stage.add(layer2);
    layer2.draw();

}
