var modules = [];
var historic = barras = "";
var standard =[new Color("#82afc1"),new Color("#d3cec6"),
               new Color("#ad9172"),new Color("#4293af"),
               new Color("#cea072"),new Color("#d21f17"),
               new Color("#867c73"),new Color("#e2ddd8"),
              ];
var colores = standard.slice(0);
"use strict";
function _(id) {
        if (window === this) {
            return new _(id);   
        }
        switch(typeof id){
            case "string":
                this.id = id;
                this.e = document.querySelectorAll(id);
                break;
        }  
        return this;
    }
_.prototype = {
    get: function(selector) {
          return this;
    },
    each: function(array, callback){
        for(var i = 0; i<array.length;i++)callback.call(this,i,array);
    },
    checkModules: function(){
          
        if(typeof(tartas) != "undefined"){
            var d = document.createDocumentFragment();
            var li=document.createElement("LI");
            li.className="active";
            li.innerHTML = "<div class='icon-pie icono'></div> Tartas";
            
            d.appendChild(li);
            modules.push(d);
        }
        if(typeof(barras) != "undefined"){
            var d = document.createDocumentFragment();
            var li=document.createElement("LI");
            li.innerHTML = "<div class='icon-bars2 icono'></div> Barras";
            d.appendChild(li);
            modules.push(d);
        }
        if(typeof(historic) != "undefined"){
            var d = document.createDocumentFragment();
            var li=document.createElement("LI");
            li.innerHTML = "<div class='icon-stats icono'></div> Historicos";
            d.appendChild(li);
            modules.push(d);
        }
        return this;
    },
    menu: function(){
        this.checkModules();
        var dest = Array.prototype.slice.call(this.e);
        modules.forEach(function(el){(dest).forEach(function(t){t.appendChild(el)})});
        return this;
    },
    options: function(){
        if(typeof opciones != "undefined"){}
        return this;  
    },
    draw: function(item){
        _.layer.add(item);
        _.layer.draw();
    },
    drawLabel : function(posx, posy, width, height, fill, textColor, text){
        
        var group = new Kinetic.Group({draggable:true, id: "group_label"});
        var text = new Kinetic.Text({
            x: posx,
            y: posy-10,
            fontSize: 20,
            fontFamily: "Open Sans",
            text: text,
            fill: textColor,
            padding: 15,
        });
        var box = new Kinetic.Rect({
            x: posx,
            y: posy,
            width: width,
            height: height,
            fill: fill,
        });
        var circle = new Kinetic.Circle({
            x: posx + 135,
            y: posy+10,
            radius: 5,
            fill: fill,
            stroke: "white",
            strokeWidth: 1
        });
        circle.on('click', function(){
            group.destroy(this);
            _.layer.draw();
        })
        group.on('mouseover', function(){
            document.body.style.cursor = 'pointer';
        });
        group.on('mouseout', function() {
            document.body.style.cursor = "default";
        });
        group.add(box);
        group.add(text);
        group.add(circle);
        this.draw(group);
        return this;
    },
    canvas: function(canvas,callback){
        //var w = parseInt(window.getComputedStyle(canvas).width.replace("px",""));
        //var h = parseInt(window.getComputedStyle(canvas).height.replace("px",""));
        var w = 370;
        var h = 380;
        this.stage = new Kinetic.Stage({
            container: canvas,
            width: w,
            height: h,
        });
        canvas.style.background="#fff";       
        _.layer = new Kinetic.Layer();
        
        var rectX = this.stage.getWidth() /2 -75;
        var rectY = this.stage.getHeight() /2 -25;
               
        var stage = this.stage;       
        document.getElementById('save').addEventListener('click', function() {
            var c = document.getElementsByTagName("canvas")[0];
            c.style.background="#fff";  
            var url = _().canvasToImage(c,"#fff");
            //var img = new Image();
        
            //document.getElementById("img").setAttribute("src",c.toDataURL());
            window.open(url);
          }, false);       
        this.stage.add(_.layer);
        if(modules.length == 0)
           this.drawLabel(rectX,rectY,150,25,"rgba(0,0,0,0.7)","#fff","No hay Módulos");
        _.layer.draw();
        callback.call(this);
    },
    canvasToImage: function(canvas,backgroundColor)
    {
        //cache height and width		
        var w = canvas.width;
        var h = canvas.height;
        var context = canvas.getContext("2d");
        var data;
     
        if(backgroundColor)
        {
            //get the current ImageData for the canvas.
            data = context.getImageData(0, 0, w, h);
     
            //store the current globalCompositeOperation
            var compositeOperation = context.globalCompositeOperation;
     
            //set to draw behind current content
            context.globalCompositeOperation = "destination-over";
     
            //set background color
            context.fillStyle = backgroundColor;
     
            //draw background / rect on entire canvas
            context.fillRect(0,0,w,h);
        }
     
        //get the image data from the canvas
        var imageData = canvas.toDataURL("image/jpeg");
     
        if(backgroundColor)
        {
            //clear the canvas
            context.clearRect (0,0,w,h);
     
            //restore it with original / cached ImageData
            context.putImageData(data, 0,0);
     
            //reset the globalCompositeOperation to what it was
            context.globalCompositeOperation = compositeOperation;
        }
     
        //return the Base64 encoded data url string
        return imageData;
    }
};
