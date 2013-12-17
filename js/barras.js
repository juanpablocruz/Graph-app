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
_.prototype.createBarsVerticalAxis = function(max){

    var step = 10000;
    var ctx = this.ctx;
    var h = ctx.canvas.height-30;

    var posy = Math.floor((h)/(max/step));
    var contador = 0;
    ctx.font = "12px 'Mic 32 New Rounded'";
    ctx.fillStyle = "#333";
    var oy=0;
    var text;
        _.layer.add(new Kinetic.Shape({
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
            stroke: "#FFF",
            strokeWidth: 1,
        }));

_.layer.draw();
}

_.prototype.drawColumn = function(ancho,h,wBar,color,value,label){
    var ctx = this.ctx;
    ctx.font = "12px 'Mic 32 New Rounded'";
    _.layer.add(new Kinetic.Shape({
            drawFunc: function(ctx){
                ctx.beginPath();
                ctx.rect(ancho+50,h+200,wBar,-value);
                ctx.closePath();
            },
            fill:color,
            stroke: "#FFF",
            strokeWidth: 1,
        }));
    _.layer.draw();
}
_.prototype.calcBarHeight = function(i,j,h,max){
    return (this.data[i][Object.keys(this.data[i])[j]]*(h)/(max));
}

_.prototype.createBarsHorizontalAxis = function(max){
    var numBarras = this.data.length;
    var w = this.ctx.canvas.width-30;
    var h = this.ctx.canvas.height-30;

    var wBar = Math.floor(w/numBarras);
    var max_grupos = 2;
    var tmp = Array();
    coloresBarra = ["#ad9172","#4293af","#d21f17","#d3cec6", "#cea072", "#72afc1"]
    var n = 0;
    for (var j=0; j<this.data.length; j++){
        var tmp_sum = 0;
        for (var i=0; i< Object.keys(this.data[0]).length; i++){
            var value = this.calcBarHeight(j,i,h,max);
            this.drawColumn(n,h+tmp_sum,wBar,coloresBarra[(i-1)%(coloresBarra.length-1)],value,Object.keys(this.data[0])[j]);
            tmp_sum += value;
            n += wBar;
        }
        tmp.push(tmp_sum);
    }
}
