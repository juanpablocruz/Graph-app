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
    //this.createBarsHorizontalAxis(maximo);
}
_.prototype.getMaxValue = function (){
    var max = 0;
    for(var i=0;i< this.data.length;i++){
        var tmp = 0;
        for(var j=0; j < Object.keys(this.data[0]).length; j++) {
            tmp += this.data[i][Object.keys(this.data[i])[j]];
        }
        if(tmp > max){
             max = tmp;
        }
    }
    return max;
}
Array.prototype.minVal = function(){
    var min = Infinity;
    _().each(this,function(i,a){
        if(min==Infinity || this[i]<min)min = a[i];
    });
    return min;
}
_.prototype.getInterval = function(d){
    var tmp = [];
    for (var k=0; k < Object.keys(d[k]).length;k++) {
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
    var h = ctx.canvas.height-30;
    console.log(step+" "+max);
    var posy = Math.floor((h)/(max/step));
    var contador = 0;
    ctx.font = "12px 'Mic 32 New Rounded'";
    ctx.fillStyle = "#333";
    var oy=0;
    var text;

    var yaxis = new Kinetic.Shape({
        drawFunc: function(ctx){
            for (var j = 0; j < max+step; j+=step) {
                oy = h-(posy*contador);
                ctx.fillText(j,0,oy-5);
                ctx.beginPath();
                ctx.moveTo(0,oy);
                ctx.lineTo(ctx.canvas.width,oy);
                ctx.closePath();
                ctx.stroke();
                contador++;
            };
        },
        id: "axis",
        stroke: "#FFF",
        strokeWidth: 1,
    });
    _.layer.add(yaxis);
    _.layer.draw();



}

_.prototype.drawColumn = function(ancho,h,wBar,color,value,label){
    var ctx = this.ctx;
    ctx.font = "12px 'Mic 32 New Rounded'";

    _layer2.add(new Kinetic.Shape({
            drawFunc: function(ctx){
                ctx.beginPath();
                ctx.rect(ancho+50,h+200,wBar,-value);
                ctx.closePath();
            },
            fill:color,
            stroke: "#FFF",
            strokeWidth: 1,
        }));
    this.layer2.draw();
    this.stage.add(this.layer2);

}
_.prototype.calcBarHeight = function(i,j,h,max){
    return (this.data[i][Object.keys(this.data[i])[j]]*(h)/(max));
}

_.prototype.createBarsHorizontalAxis = function(max){
    var w = this.ctx.canvas.width-30;
    var h = this.ctx.canvas.height-30;
    var N = this.data.length;
    var m = 10;
    var wBar = (w - N*m)/N;
    var maximo = this.getMaxValue();
    for (var j=0; j<this.data.length; j++){
        for (var i=0; i< Object.keys(this.data[0]).length; i++){
            var value = (this.data[j][Object.keys(this.data[0])[i]]*h)/maximo;
            var barra = new Kinetic.Shape({
                drawFunc: function(ctx){
                    ctx.beginPath();
                    ctx.rect(50*j,ctx.canvas.height-30,wBar,-value);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                },
                fill:'#00D2FF',
                stroke: 'black',
                strokeWidth:1,
            });
            _.layer.add(barra);
        }
    }
    _.layer.draw();
}
