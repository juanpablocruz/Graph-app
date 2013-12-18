var barras = 1;
"use strict";

_.prototype.bars= function (obj) {
    var id = this.id;
    _().canvas(this.e[0],function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.addBarTools();
        this.drawBar(this.canvas,obj.data);
    });
}

_.prototype.addBarTools = function(){
   var menu = document.querySelectorAll("menu")[0];
   menu.innerHTML = "";
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

            if(labels.indexOf(i)==-1){
                labels.push(i);

                var texto = Object.keys(this.data[0])[i];
                console.log(this.data[0]);
                var lwidth =  this.ctx.measureText(texto).width;
                this.drawLabel(50,this.ctx.canvas.height-40-height_accumulated,lwidth,20,"#333","white",texto,layer2);
            }
            height_accumulated+=(this.data[j][Object.keys(this.data[0])[i]]*h)/maximo;
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
