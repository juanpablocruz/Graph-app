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
            if(this.data[i][Object.keys(this.data[i])[j]] > max) {
             max = this.data[i][Object.keys(this.data[i])[j]];
            }
        }
    }
    var len = max.toString().split(".")[0].length;
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

    var posicion = this.createBarsVerticalAxis(maximo,5,"historico");
    this.drawHistoricBars(posicion);
}

_.prototype.drawHistoricBars = function(posicion){
    var w = this.ctx.canvas.width-20;
    var h = this.ctx.canvas.height-20;
    var x = w/this.data.length;
    var data = this.data;
    var a = -x;
    var maximo = this.getMaxValue();
    var puntos = [];
    var offset = ((posicion["step"]*(posicion["numero"]))*h/maximo);
    var des_orig = (posicion["origen"] < 0)? posicion["origen"]:0;
    for ( var j=1; j < Object.keys(data[0]).length; j++ ) {
        linea_set = [];
        a = -x;
        for(var i=0;i< data.length;i++){
            var value = (((data[i][Object.keys(data[0])[j]]- des_orig)*h)-offset)/(maximo);

            linea_set.push({x:a+x,y:-(value-offset)});
            a+=x;
        }
        puntos.push(linea_set);
    };
    var layer_hist = new Kinetic.Layer();
    for ( var i=0; i< puntos.length;i++ ) {
        var line = new Kinetic.Line({
            points: puntos[i],
            stroke: colores_barras[i].hex,
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
        });
        line.move(40,h);
        layer_hist.add(line);
    }

    for ( var j=0;j < data.length; j++ ) {
        var year = new Kinetic.Text({
            x: 35+puntos[0][j]["x"],
            y: h,
            fontSize: 12,
            fontFamily: 'Mic 32 New Rounded',
            text: this.data[j][Object.keys(this.data[0])[0]],
            fill: "black",
            padding: 1,
        });
        layer_hist.add(year);
    }

    this.stage.add(layer_hist);
    layer_hist.draw();
}
