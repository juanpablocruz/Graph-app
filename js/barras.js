var barras = 1;
"use strict";

_.prototype.bars= function (obj) {
    var id = this.id;
    _().canvas(this.e[0],function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.printLabels = true;
        if(localStorage.drawLabels){
            this.printLabels = localStorage.drawLabels;
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
        checkbox_title.setAttribute("id","label-dibujar-check");
        checkbox_title.innerHTML = "Dibujar Etiquetas";
    if(this.printLabels === "false"){
        checkbox_title.className = "icon-check-empty";
        checkbox_labels.checked = false;
    }
    else {
        checkbox_title.className = "icon-check";
        checkbox_labels.checked = true;
    }
        checkbox_labels.addEventListener("click",function(){
            _("#graph").bars({data:data});
        });

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
                colorinpt.value = colores_barras[j-1].hex;

            div.appendChild(colorinpt);
        }
        li1.appendChild(div);
        if (j > 0) li1.className = "data-list-li-holder";

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
    var inpt_sub = document.createElement("BUTTON");
        inpt_sub.innerHTML = "Dibujar<div class='icon-pencil icono'></div> ";
        inpt_sub.className = "draw_button";
    var inpt_activar = document.createElement("BUTTON");
        inpt_activar.innerHTML = "Reordenar<div class='icon-rearrange icono'></div> ";
        inpt_activar.className = "rearrange-button";
    div_data.appendChild(ul);

    div_container.appendChild(div_data);
    div_container.appendChild(div_options);
    f.appendChild(div_container);
    f.appendChild(inpt_sub);
    f.appendChild(inpt_activar);
    data_content.appendChild(f);
}

_.prototype.drawBar = function(canvas,data){
    this.ctx = canvas.getContext("2d");
    this.data = data;
    var maximo = this.getMaxValue();
    this.createBarsVerticalAxis(maximo);
    this.createBarsHorizontalAxis(maximo);
}
_.prototype.getMaxValue = function (){
    var max = 0;
    for(var i=0;i< this.data.length;i++){
        var tmp = 0;
        for(var j=1; j < Object.keys(this.data[0]).length; j++) {
            tmp += this.data[i][Object.keys(this.data[i])[j]];
        }
        if(tmp > max){
             max = tmp;
        }
    }
    return max;
}
_.prototype.getInterval = function(d){
    var tmp = [];
    for (var k=1; k < Object.keys(d).length;k++) {
        var sum = 0;
        var l = Object.keys(d[0])[k];
        for (var i=0; i<d.length; i++) {
            sum += d[i][l];
        }
        tmp.push(sum);
    }
    var min = tmp.minVal();
    return Math.floor(min/(d.length*4));
}

_.prototype.createBarsVerticalAxis = function(max){
    var step = this.getInterval(this.data);

    var ctx = this.ctx;
    var h = ctx.canvas.height-20;
    var posy = Math.floor((h)/(max/step));
    var contador = 0;
    ctx.font = "12px 'Mic 32 New Rounded'";
    //ctx.fillStyle = "#333";
    var oy=0;
    var text;
    var yaxis = new Kinetic.Shape({
        drawFunc: function(ctx){
            for (var j = 0; j < max+step; j+=step) {
                var x = j.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                oy = h-(posy*contador);
                ctx.fillText(x,0,oy-5);
                ctx.beginPath();
                ctx.moveTo(0,oy);
                ctx.lineTo(ctx.canvas.width,oy);
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
}
_.prototype.drawBarra = function(maximo,i,j,h,height,layer,wBar,m){
    var value = (this.data[j][Object.keys(this.data[0])[i]]*h)/maximo;
    var barra = new Kinetic.Shape({
        drawFunc: function(ctx){
            ctx.beginPath();
            ctx.rect(40+((wBar+m)*j),height,wBar,-value);
            ctx.closePath();
            ctx.fillStrokeShape(this);
        },
        stroke: "#FFF",
        strokeWidth: 1,
        fill: colores_barras[i-1].hex,
    });
    layer.add(barra);
}
_.prototype.createBarsHorizontalAxis = function(max){
    var w = this.ctx.canvas.width-30;
    var h = this.ctx.canvas.height-30;
    var N = this.data.length;
    var m = 10;
    if(N<4)m = m*((1/((N*100)/6)))*100;
    var wBar = (w - N*m)/N;
    var maximo = this.getMaxValue();
    var layer2 = new Kinetic.Layer();
    var height_accumulated = 0;
    var labels = [];
    for (var j=0; j<this.data.length; j++){
        for (var i=1; i< Object.keys(this.data[0]).length; i++){
            this.drawBarra(maximo,
                           i, j, h,
                           this.ctx.canvas.height-20-height_accumulated,
                           layer2,wBar,m);
            if(labels.indexOf(i)==-1 && this.printLabels === "true"){
                console.log(this.printLabels);
                labels.push(i);

                var texto = Object.keys(this.data[0])[i];
                console.log(this.data[0]);
                var lwidth =  this.ctx.measureText(texto).width;
                this.drawLabel(50,this.ctx.canvas.height-40-height_accumulated,lwidth,20,
                               "#333","white",texto,layer2);
            }
            height_accumulated+=(this.data[j][Object.keys(this.data[0])[i]]*h)/maximo;
        }
        var year = new Kinetic.Text({
            x: 55+j*(wBar+m),
            y: this.ctx.canvas.height-20,
            fontSize: 12,
            fontFamily: 'Mic 32 New Rounded',
            text: this.data[j][Object.keys(this.data[0])[0]],
            fill: "black",
            padding: 1,
        });
        console.log(m);
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
