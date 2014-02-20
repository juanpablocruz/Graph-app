var modules = [];    // Lista de modulos disponibles
var direccion = "";  // Variable global para albergar la dirección de lectura de datos
var error = ["", "1: JSON.parse ha recibido una variable indefinida ","2: Se esperaba un número, se encontró texto",
             "3: Se esperaba un número, se encontró Infinity", "4: División por cero"];
var colores =[new Color("#d21f17"),new Color("#d3cdc7"),   // Lista de colores
               new Color("#ad9172"),new Color("#4293af"),
               new Color("#cea072"),new Color("#82afc1"),
               new Color("#867c73"),new Color("#e2ddd8"),
              ];

var colores_barras = [colores[3],colores[0],colores[2],colores[4],colores[1]];  // Lista de colores para las barras
var colores_alpha = ["rgba(0,0,0,0)",colores[3],colores[2],colores[4],colores[1],colores[0]];   // Lista de colores para las barras con destacado, el primer elemento se hace invisible

var Memory = {
    memoria:[],
    config:{max:3},
    fields: [],
    log: function(t) {
        console.log(t);
    },
    each: function(a,f) { for(var i = 0; i < a.length; i++) {f(a[i],i,a,this);}  },
    dump: function() { this.each(this.memoria,function(i,a,c,d) {d.log(i);}); },
    save: function(d) {
        if ( this.memoria.length == this.config["max"] )this.memoria.shift();
        this.memoria.push(d);
        this.each(this.fields, function (e,i,a,m) {
            localStorage[e] = m.memoria[m.memoria.length - 1][e];
        });
        sessionStorage["memory"] = JSON.stringify(this.memoria);
    },
    load: function() {
        if(this.memoria.length > 1) {
            this.memoria.pop();
            return this.memoria[this.memoria.length-1];
        }
        else {
            return -1;
        }
    },
    parse: function(d) {
        try {return JSON.parse(d);}
        catch(e) {return d;}
    },
    init: function(f) {
        this.fields = f;
        try {
            if(sessionStorage.memory) this.memoria = this.parse(sessionStorage.memory);
        } catch(e) {

        }
    },
};

function _(id) {
    if (window === this) {
        return new _(id);
    }
    switch (typeof id) {
        case "string":
            this.id = id;
            Memory.init(["data","output","current","ordenacion","coloresBarras"]);
            this.alreadySaved = false;
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

    each: function(array, callback){                                        // función de iteración
        for(var i = 0; i<array.length;i++)callback.call(this,i,array);
    },

    checkModules: function() {
        /*
        *  Si existe el modulo, crea el elemento de menu
        *  y añadelo a la lista de módulos
        */
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

    drawLabel : function(posx, posy, height, fill, textColor, texto, padding, layer) {

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
            text: texto,
            fill: textColor,
            padding: padding,
        });
        var font = this.ctx.font;
        this.ctx.font = "12px 'Open Sans'";

        var lwidth = this.ctx.measureText(texto).width;
        var box = new Kinetic.Rect({
            x: posx,
            y: posy,
            width: lwidth + 5,
            height: height,
            fill: fill,
        });
        this.ctx.font = font;
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
        var tmp_canvas = canvas.cloneNode(true);

        //cache height and width
        var w = canvas.width;
        var h = canvas.height;

        var tmp_ctx = tmp_canvas.getContext("2d");
         _().each(document.getElementsByTagName("canvas"),function(i,l) {
            tmp_ctx.drawImage(l[i],0,0);
        });

        var data;

        if (backgroundColor) {
            data = tmp_ctx.getImageData(0, 0, w, h);
            var compositeOperation = tmp_ctx.globalCompositeOperation;
            tmp_ctx.globalCompositeOperation = "destination-over";
            tmp_ctx.fillStyle = backgroundColor;
            tmp_ctx.fillRect(0,0,w,h);
        }
        var imageData = tmp_canvas.toDataURL("image/jpeg");

        if (backgroundColor) {
            tmp_ctx.clearRect (0,0,w,h);
            tmp_ctx.putImageData(data, 0,0);
            tmp_ctx.globalCompositeOperation = compositeOperation;
        }
        return imageData;
    },

    getInterval: function (max,bars) {
        try {
            if(isNaN(max) || isNaN(bars)) throw error[2];
            var v = Math.round(max/bars)
            var len = v.toString().length;
            var orden = Math.pow(10, len - 1);
            var next = parseInt( v / orden );
            return parseInt(next * orden);
        } catch (e) {
            console.log("Error"+e);
            return -1;
        }
    },

    getMinValue: function () {
        var min = Infinity;
        for (var i = 0;i < this.data.length; i++) {
            for (var j = 1; j < Object.keys(this.data[0]).length; j++) {
                try {
                    if (isNaN(this.data[i][Object.keys(this.data[i])[j]])) throw error[2];
                    if (this.data[i][Object.keys(this.data[i])[j]] < min) {
                        min = this.data[i][Object.keys(this.data[i])[j]];
                    }
                } catch(e) {
                    console.log("Error"+e);
                }
            }
        }
        try {
            if (min === Infinity) throw error[3];
            var len = min.toString().length;
            var orden = Math.pow(10, len - 1);
            var next = parseInt( min / orden );
            var min = next * orden;
            return parseInt(min);
        } catch(e) {
            console.log("Error"+e);
        }

        return -1
    },

    getStep : function(max,bars) {
        var step = this.getInterval(max,bars);
        var h = this.ctx.canvas.height-20;
        var posy = 0;
        try {
            if(step == 0) throw error[4];
            posy = Math.floor((h)/(max/step));
        } catch (e) {
            console.log("Error"+e);
        }
        return {val: posy, label: step};
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
            x: ctx.canvas.width - (ctx.measureText("Unidad: "+unidad_value).width + 15),
            y: 1 ,
            text: "Unidad: "+unidad_value,
            fontSize: 13,
            fontFamily: "infotext,InfoTextBook,Helvetica,arial",
            fontStyle: "italic",
            fill: "#7B796C",

        });

        _.layer.add(unidades);

        var h = ctx.canvas.height-20;
        var posy = 0;
        try {
            if(step == 0 || max/step == 0) throw error[4];
            posy = Math.floor((h)/(max/step));
        } catch(e) {
            console.log("Error"+e);
        }

        var contador = 0;
        ctx.font = "12px 'Mic 32 New Rounded',mic32newrd,arial";
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
            if(minimo < 0) origen = -step;
            else {
                origen = step * parseInt(minimo/step);
            }

        }

        this.origen = origen;
        var yaxis = new Kinetic.Shape({
            drawFunc: function(ctx) {
                for (var j = origen; j < max-(step/2)+origen; j+= step) {

                    var x = j.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    oy = h - (posy * contador);
                    if(x.length > 3) x = x.substring(0,x.length-4);
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
    },
    saveStep: function() {
        var output = new Array();
        var orden;
        var coloresBarras;
        $("#output tr").each(function(i,j) {
            output.push(new Array());
            $(j).find("td").each(function(k,l) {
                output[i].push($(l).text());
            });
        });
        if(localStorage.ordenacion) orden = localStorage.ordenacion;
        else orden = "";
        if(localStorage.coloresBarras) coloresBarras = localStorage.coloresBarras;
        else coloresBarras = "";
        Memory.save({data:localStorage.data,
                    output: JSON.stringify(output),
                    current: $(".current_step").attr("id"),
                    ordenacion: orden,
                    coloresBarras:coloresBarras,
                    });
    },

    undoAction: function() {
        var tipo = "";
        var data = [];
        var m = Memory.load();
        if (m!=-1) {
        $(".current_step").removeClass("current_step");
        $("#"+m["current"]).addClass("current_step");

        switch(m["current"]) {
            case "designer":
                data = Memory.parse(m["data"]);
                console.log(data);
                tipo = localStorage.chartType;
                localStorage.data = JSON.stringify(data);
                switch (tipo) {
                    case "Tartas":
                        _("#graph").pie({data:data});
                        break;
                    case "Barras":
                        if(m["ordenacion"] != "") localStorage.ordenacion = m["ordenacion"];
                        if(m["coloresBarras"] != "") localStorage.coloresBarras = m["coloresBarras"];
                        _("#graph").bars({data:data});
                        break;
                    case "Históricos":
                        _("#graph").history({data:data});
                        break;
                }
                break;
            case "loadData":
                    this.loadOutput(m["output"]);
                    $(".loader").toggle();
                break;
        }
        columna = false;fila=false;
        }
    },


    loadOutput: function(data) {
        var lista = Memory.parse(data);

        var table = $("<table></table>");
        lista.forEach(function(i,j) {
            var tr = $("<tr></tr>");
            lista[j].forEach(function(k,l) {
                $(tr).append("<td class='dato drop'><div>"+lista[j][l]+"</div></td>");
            });
            $(table).append(tr);
        });

        $("#output").html(table);

        var body = $("<div id='body-output'></div>");
        $(body).append("<span id='info_dir'>Sentido de datos<sup>?</sup></span>: <div id='abajo'><img src='arriba.jpg'></div><div id='lado'><img src='lado.png'></div>");

        $(body).append("<input type='radio' name='borrar' id='borrar-fila' class='button borrar-fila' value='Borrar fila'><label for='borrar-fila' id='borrar-fila-label'>Borrar fila</label>");
        $(body).append("<input type='radio' name='borrar' id='borrar-columna' class='button borrar-columna' value='Borrar columna'><label for='borrar-columna' id='borrar-columna-label'>Borrar columna</label>");
        $(body).append("<input type='radio' name='borrar' id='borrar-neutro' style='display:none;'>");
        $(body).append("<div id='undo-container'><button id='undo'><div class='icon icon-undo'></div></button></div>");
        $(body).append("<div class='button' id='render'>Crear Gráfico</div>");

        var tooltip = $("<div id='dir_tooltip'>Elige el sentido de los datos:<br/> <b>Horizontal</b> si son: etiqueta - valor o <b>Vertical</b> si son etiqueta - etiqueta y los valores debajo.</div>");
        $(body).append(tooltip);

        $("#controls").html(body);
        $(".loader").toggle();

        $("#undo").on("click",function() {
            _().undoAction();
        })
        $(".borrar-fila").on("click",function() {
            if(!fila)fila = true;
            else {fila = false;$('#borrar-neutro').prop('checked', true);}
            columna = false;
        });
        $(".borrar-columna").on("click",function() {
            if(!columna)columna = true;
            else {columna = false; $('#borrar-neutro').prop('checked', true);}
            fila = false;
        });

        $("td").on("mouseover",function(ev) {
            $(".active").toggleClass("active")
            if(columna){
                var index = $(this).index()+1;
                $("td:nth-child("+index+")").addClass("active");
            }
            else if(fila){
                $(this).parent().toggleClass("active");
            }
        });
        $("table").on("click",function(ev) {
            $(".active").remove();
            _().saveStep();
        });
        $("#abajo").on("click",function() {
            direccion = "abajo";
            $(".selection_dir").removeClass("selection_dir");
            $(this).addClass("selection_dir");
        });

        $("#lado").on("click",function() {
            direccion = "lado";
            $(".selection_dir").removeClass("selection_dir");
            $(this).addClass("selection_dir");
        });
        $("#render").on("click",function() {
            $("#fileSelect").val("");
            switch(direccion){
              case "abajo":
                    datos_vertical();
                    break;
                case "lado":
                    datos_lado();
                    break;
                default:
                    console.log("Elige dirección");
                    break;
            };
        });
        var timer;
        $("#info_dir sup").on("mouseover",function() {
            timer = setTimeout(function() {
                $("#dir_tooltip").show();
            }, 250);
        });
        $("#info_dir sup").on("mouseout",function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                $("#dir_tooltip").hide();
            }, 250);
        });
        $("#dir_tooltip").on("mouseout",function() {
            clearTimeout(timer);
            $("#dir_tooltip").hide();
        });
        function datos_vertical() {
            $(".loader").toggle();
            var a = new Array();
            for ( var i = 0; i < ($("tr").first().find("td").length)-1; i++) {
                a.push({});
            }
            $("tr").each(function(i,e) {
                $(e).find("td:gt(0)").each(function(j,el) {
                    if(!isNaN($(el).text())) {
                       a[j][$(e).find("td").first().text()] = Math.round($(el).text()*100)/100;
                       } else
                    a[j][$(e).find("td").first().text()] = $(el).text();
                });

            });
            columna = false;fila=false;
            draw(a);
        };

        function datos_lado() {
            $(".loader").toggle();
            var a = new Array();
            for ( var i = 0; i < ($("tr").length)-1; i++) {
                a.push({});
            }
            $("tr:nth-child(1)").find("td").each(function(i,e) {
                $("tr:gt(0)").find("td:nth-child("+(i+1)+")").each(function(j,el) {
                    try {
                        if(isNaN($(el).text())) throw error[2];
                        a[j][$(e).text()] = Math.round($(el).text()*100)/100;
                    } catch(err) {
                        a[j][$(e).text()] = $(el).text();
                    }
                });
            });
            columna = false;fila=false;
            draw(a);
        };

    },
    suma: function(orden) {
        if( orden.length < 1) orden = Object.keys(this.data);
        var sum = 0;

        for ( var i = 0; i < this.data.length; i++) {
            for ( var j = 0; j < orden.length; j++) {
                if(!isNaN(this.data[i][orden[j]]))
                sum += this.data[i][orden[j]];
            }
        }
        return sum;
    }
};
