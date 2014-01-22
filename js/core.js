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
            li.setAttribute("tipo","Historicos");
            li.innerHTML = "Historicos<div class='icon-stats icono'></div> ";
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
    }
};
