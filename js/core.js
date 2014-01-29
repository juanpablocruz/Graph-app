var modules = [];
var standard =[new Color("#d21f17"),new Color("#d3cec6"),
               new Color("#ad9172"),new Color("#4293af"),
               new Color("#cea072"),new Color("#82afc1"),
               new Color("#867c73"),new Color("#e2ddd8"),
              ];

var colores = standard.slice(0);
var colores_barras = [standard[3],standard[2],standard[4],standard[1],standard[0]];
var colores_alpha = ["rgba(0,0,0,0)",standard[3],standard[2],standard[4],standard[1],standard[0]];
"use strict";

function _(id) {
        if (window === this) {
            return new _(id);   
        }
        switch (typeof id) {
            case "string":
                this.id = id;
                this.e = document.querySelectorAll(id);
                break;
        }  
        return this;
    }

Array.prototype.minVal = function(){
    var min = Infinity;
    _().each(this, function(i, a) {
        if(min == Infinity || this[i] < min) min = a[i];
    });
    return min;
}

_.prototype = {
    get: function(selector) {
          return this;
    },

    each: function(array, callback){
        for(var i = 0; i<array.length;i++)callback.call(this,i,array);
    },

    checkModules: function() {
        if (typeof(tartas) != "undefined") {
            var d = document.createDocumentFragment();
            var li=document.createElement("LI");
            li.setAttribute("tipo","Tartas");
            li.innerHTML = "Tartas<div class='icon-pie icono'></div> ";
            
            d.appendChild(li);
            modules.push(d);
        }
        if (typeof(barras) != "undefined") {
            var d = document.createDocumentFragment();
            var li = document.createElement("LI");
            li.setAttribute("tipo","Barras");
            li.innerHTML = "Barras<div class='icon-bars2 icono'></div> ";
            d.appendChild(li);
            modules.push(d);
        }
        if (typeof(historic) != "undefined") {
            var d = document.createDocumentFragment();
            var li = document.createElement("LI");
            li.setAttribute("tipo","Históricos");
            li.innerHTML = "Históricos<div class='icon-stats icono'></div> ";
            d.appendChild(li);
            modules.push(d);
        }
        return this;
    },

    menu: function() {
        this.checkModules();
        var dest = Array.prototype.slice.call(this.e);
        modules.forEach( function(el) {
            (dest).forEach( function(t){
                t.appendChild(el)
            })
        });
        return this;
    },
    type_menu: function() {
        switch(localStorage.chartType) {
            case "Tartas":
                this.pie_type_menu();
                break;
            case "Barras":
                this.bars_type_menu();
                break;
            case "Históricos":
                this.history_type_menu();
                break;
        }
      return this;
    },
    draw: function(item) {
        _.layer.add(item);
        _.layer.draw();
    },

    drawLabel : function(posx, posy, width, height, fill, textColor, text, padding, layer) {
        
        var group = new Kinetic.Group({
            draggable:true,
            id: "group_label",
            name:"label"
        });

        var text = new Kinetic.Text({
            x: posx,
            y: posy + 2,
            fontSize: 12,
            fontFamily: "Open Sans",
            text: text,
            fill: textColor,
            padding: padding,
        });
        var box = new Kinetic.Rect({
            x: posx,
            y: posy,
            width: width + 10,
            height: height,
            fill: fill,
        });

        group.add(box);
        group.add(text);
        layer.add(group);
        return this;
    },

    canvas: function(canvas,callback) {
        var w = 370;
        var h = 380;
        this.stage = new Kinetic.Stage({
            container: canvas,
            width: w,
            height: h,
        });

        canvas.style.background="#fff";       
        _.layer = new Kinetic.Layer();
        
        var rectX = this.stage.getWidth() / 2 -75;
        var rectY = this.stage.getHeight() / 2 -25;
               
        var stage = this.stage;       
        document.getElementById('save').addEventListener('click', function(e) {
            var c = document.getElementsByTagName("canvas")[0];
            c.style.background="#fff";  
            var url = _().canvasToImage(c,"#fff");
            this.href = (url);
          }, false);

        this.stage.add(_.layer);
        if(modules.length == 0)
           this.drawLabel(rectX,rectY,150,25,"rgba(0,0,0,0.7)","#fff","No hay Módulos",_.layer);
        _.layer.draw();
        callback.call(this);
    },

    canvasToImage: function(canvas, backgroundColor) {
        var c = document.getElementsByTagName("canvas")[1];
        //cache height and width		
        var w = canvas.width;
        var h = canvas.height;
        var context = canvas.getContext("2d");
        if (typeof c != "undefined") context.drawImage(c,0,0);
        var data;
     
        if (backgroundColor) {
            data = context.getImageData(0, 0, w, h);
            var compositeOperation = context.globalCompositeOperation;
            context.globalCompositeOperation = "destination-over";
            context.fillStyle = backgroundColor;
            context.fillRect(0,0,w,h);
        }
        var imageData = canvas.toDataURL("image/jpeg");
     
        if (backgroundColor) {
            context.clearRect (0,0,w,h);
            context.putImageData(data, 0,0);
            context.globalCompositeOperation = compositeOperation;
        }
        return imageData;
    },
    getInterval: function (max,bars) {
        return Math.ceil(max/(bars));
    },

    getMinValue: function () {
        var min = Infinity;
        for (var i = 0;i < this.data.length; i++) {
            for (var j = 1; j < Object.keys(this.data[0]).length; j++) {
                if (this.data[i][Object.keys(this.data[i])[j]] < min) {
                    min = this.data[i][Object.keys(this.data[i])[j]];
                }
            }
        }

        var len = min.toString().length;
        var orden = Math.pow(10, len - 1);
        var next = parseFloat( min / orden );
        var min = next * orden;
        return min;
    },
    getStep : function(max,bars) {

        var step = this.getInterval(max,bars);
        var h = this.ctx.canvas.height-20;
        var posy = Math.floor((h)/(max/step));
        return {val: posy,
                label: step};
    },
    createBarsVerticalAxis: function(max_val,bars,type){
        if(barras_mode != "cols") {
            var max = max_val;
            var step = this.getInterval(max,bars);
            this.ceil = ((((max+step*2)/step)-2)*step);
        }
        else {
            var max = 100;
            var step = 20;
            this.ceil = ((((max+step*2)/step)-2)*step);
        }

        this.step = step;
        var ctx = this.ctx;

        var fuente = new Kinetic.Text({
            x: ctx.canvas.width - 15,
            y: ctx.canvas.height - 20 ,
            text: "Fuente: "+fuente_value,
            fontSize: 13,
            fontFamily: "infotext,InfoTextBook,Helvetica,arial",
            fontStyle: "italic",
            fill: "#7B796C",
            rotationDeg: -90,
        });
        _.layer.add(fuente);
        var unidades = new Kinetic.Text({
            x: ctx.canvas.width - (ctx.measureText("Unidad: "+unidad_value).width*1.5),
            y: 1 ,
            text: "Unidad: "+unidad_value,
            fontSize: 13,
            fontFamily: "infotext,Helvetica,arial,InfoTextBook",
            fontStyle: "italic",
            fill: "#7B796C",

        });
        _.layer.add(unidades);

        var h = ctx.canvas.height-20;
        var posy = Math.floor((h)/(max/step));
        var contador = 0;
        ctx.font = "12px 'Mic 32 New Rounded,mic32newrd,arial'";
        //ctx.fillStyle = "#333";
        var oy=0;
        var text;
        var minimo = this.getMinValue(this.data);
        var origen = 0;
        var posicion = {bajo:false, step: step, numero: 0, origen: 0};
        if (type == "historico" && (minimo - ( 2 * step ) >= 0 || minimo < 0)) {
            posicion["bajo"] = true;
            posicion["numero"] = parseInt(minimo / step);
            posicion["origen"] = minimo;
            origen=minimo;
            step = this.getInterval(max,bars);
        }
        this.origen = origen;
        var yaxis = new Kinetic.Shape({
            drawFunc: function(ctx) {
                for (var j = origen; j < max-(step/2)+origen; j+= step) {
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
};
