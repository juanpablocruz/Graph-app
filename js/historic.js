var historic = 1;
"use strict";

_.prototype.history= function (obj) {
    var id = this.id;
    _().canvas(this.e[0],function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.printLabels = true;
        if(localStorage.drawLabels){
            this.printLabels = localStorage.drawLabels;
        }
        this.addHistTools(obj.data);
        this.drawHist(this.canvas,obj.data);
    });
}
_.prototype.getMaxValue = function (){
    var max = 0;
    for(var i=0;i< this.data.length;i++){
        for(var j=1; j < Object.keys(this.data[0]).length; j++) {
            if(this.data[i][Object.keys(this.data[i])[j]] > max){
             max = this.data[i][Object.keys(this.data[i])[j]];
            }
        }
    }
    var len = max.toString().length;
    var orden = Math.pow(10,len-1);
    var next = parseInt(max/orden)+1;
    var max = next * orden;
    return max;
}

_.prototype.addHistTools = function(data){
    //  Left Menu
    var menu = document.querySelectorAll("menu")[0];
        menu.innerHTML = "";

    //  Under Graph data
    var data_content = document.querySelectorAll("#graph-data")[0];
        data_content.innerHTML = "";
}

_.prototype.drawHist = function(canvas,data){
    this.ctx = canvas.getContext("2d");
    this.data = data;
    var maximo = this.getMaxValue();

    this.createBarsVerticalAxis(maximo,5);
    this.drawHistoricBars();
}

_.prototype.drawHistoricBars = function(){
    var w = this.ctx.canvas.width-30;
    var h = this.ctx.canvas.height-30;
    var x = w/this.data.length;
    var data = this.data;
    var a = -x;
    var layer_hist = new Kinetic.Layer();
    var line = new Kinetic.Shape({
        drawFunc: function(ctx){
            var prevx = 0, prevy = h;
            //console.log(Object.keys(data[0]).length);
            /*for(var j=1; j < Object.keys(data[0]).length; j++) {
                for(var i=0;i< data.length;i++){
                    ctx.beginPath();
                    ctx.moveTo(prevx,prevy);
                    console.log(data[i][Object.keys(data[0])[j]]);
                    ctx.lineTo(a+x,data[i][Object.keys(data[0])[j]][i]);
                    ctx.closePath();
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    a+=x;
                    prevx = a;
                    prevy = data[i][Object.keys(data[0])[j]][i];
                }
            };*/

            ctx.beginPath();
            ctx.moveTo(100, 50);
            ctx.lineTo(420, 80);
            ctx.quadraticCurveTo(300, 100, 260, 170);
            ctx.closePath();
          // KineticJS specific context method
            ctx.fillStrokeShape(this);
        },
        id: "Graphic",
    });
    layer_hist.add(line);
    this.stage.add(layer_hist);
    layer_hist.draw();
    console.log(line);

}
