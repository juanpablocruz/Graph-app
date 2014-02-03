var tartas = 1;
var pie_mode = "simple";
"use strict";
var fuente_value = "Cores";
if (localStorage.fuente) {
    fuente_value = localStorage.fuente;
}
if (!localStorage.pie_mode) {
    localStorage.pie_mode = "simple";
} else {
    pie_mode = localStorage.pie_mode;
}

function create_data_set(dest, d) {
    dest.innerHTML = "";
    var f = document.createDocumentFragment(), contenedor = document.createElement("DIV"),
        create = document.createElement("BUTTON"), grupos = document.createElement("DIV");
    contenedor.setAttribute("id", "data-list");

    create.setAttribute("id", "create-group");
    if (pie_mode === "simple") {
        create.className = "complex_pie simple_pie";
    } else {
        create.className = "complex_pie";
    }
    create.innerHTML = "Añadir Grupo";
    grupos.setAttribute("id", "attr-grupos");
    grupos.className = "data-options";
    var ul = document.createElement("UL");
    grupos.appendChild(create);
    if (localStorage.grupos) {
        var g = JSON.parse(localStorage.grupos);
        _().each(g, function (j, a) {                                   //create each group
            var li = document.createElement("LI");
            if (pie_mode === "simple")
                li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie simple_pie'>" + a[j].label + "</span>";
            else
                li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie'>" + a[j].label + "</span>";
            var ul2 = document.createElement("UL");
            $(li).droppable({
                addClasses : false,
                accept: ".data-list-li",
                drop: function (e, ui) {
                    $(this).find("ul").append(ui.draggable);
                }
            });
            _().each(d, function (i) {                                  // Create each portion in its own group
                if (d[i].group !== "" && d[i].group === a[j].label) {
                    if(d[i]["color"])color = d[i]["color"];
                else if(i>=colores.length){
                    var color = colores[(i%colores.length)+2].hex;
                }
                else{
                    var color=colores[i].hex;
                }
                var li2 = document.createElement("LI");
                li2.className = "data-list-li";
                var cont = document.createElement("DIV");
                cont.className = "data-list-element";
                var inpt_val = document.createElement("INPUT");
                inpt_val.type = "number";
                inpt_val.value = d[i]["value"];
                inpt_val.className = "value";
                var inpt_labl = document.createElement("INPUT");
                inpt_labl.type = "text";
                inpt_labl.value = d[i]["label"];
                inpt_labl.className = "label";
                var inpt_color = document.createElement("INPUT");
                inpt_color.type = "color";
                inpt_color.value = color;
                inpt_color.className = "color";
                cont.appendChild(inpt_labl);
                cont.appendChild(inpt_val);
                cont.appendChild(inpt_color);
                li2.appendChild(cont);
                ul2.appendChild(li2);
                $(li2).draggable({
                        addClasses : false,
                        revert: true,
                    });
                }
            });
            li.appendChild(ul2);
            ul.appendChild(li);
            grupos.appendChild(ul);

        });
    }
    else{                                               // If there's no groups create one and add everything in
        var li = document.createElement("LI");
        if(pie_mode == "simple")
           li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie simple_pie' val='0'>Grupo1</span>";
        else
            li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie' val='0'>Grupo1</span>";
        var ul2 = document.createElement("UL");

        _().each( d,function (i, a) {
            if (d[i]["color"]) {
                color = d[i]["color"];
            }
            else if (i>=colores.length) {
                var color = colores[(i+2)%colores.length].hex;
            }
            else {
                var color=colores[i].hex;
            }
            var li2 = document.createElement("LI");
            li2.className = "data-list-li";
            var cont = document.createElement("DIV");
            cont.className = "data-list-element";
            var inpt_val = document.createElement("INPUT");
            inpt_val.type = "number";
            inpt_val.value = d[i]["value"];
            inpt_val.className = "value";
            var inpt_labl = document.createElement("INPUT");
            inpt_labl.type = "text";
            inpt_labl.value = d[i]["label"];
            inpt_labl.className = "label";
            var inpt_color = document.createElement("INPUT");
            inpt_color.type = "color";
            inpt_color.value = color;
            inpt_color.className = "color";
            cont.appendChild(inpt_labl);
            cont.appendChild(inpt_val);
            cont.appendChild(inpt_color);
            li2.appendChild(cont);
            ul2.appendChild(li2);
            $(li2).draggable({
                    addClasses : false,
                    revert: true,
                });

        });
        li.appendChild(ul2);
        ul.appendChild(li);
        grupos.appendChild(ul);
    }
    var div_options = document.createElement("DIV");
        div_options.className = "data-options";
        div_options.setAttribute("id","options-bars");
    var fuente_label = document.createElement("DIV");
        fuente_label.innerHTML = "<span>Fuente: </span>";
    var fuente_inpt = document.createElement("INPUT");
        fuente_inpt.type = "text";
        fuente_inpt.setAttribute("id","fuente_input");
        fuente_inpt.setAttribute("value",fuente_value);
    fuente_label.appendChild(fuente_inpt);
    div_options.appendChild(fuente_label);

    var inpt_sub = document.createElement("BUTTON");                            // Create draw button
        inpt_sub.type = "submit";
        inpt_sub.innerHTML = "Dibujar<div class='icon-pencil icono'></div> ";
        inpt_sub.className = "draw_button";
        inpt_sub.addEventListener('click',function(){                           // Add click event to draw
            var grupos_list = [];
            _().each(document.querySelectorAll(".grupo_tag"),function(i,a){     // Fetch all the data inside each item
                grupos_list.push({label:a[i].innerHTML,value:a[i].getAttribute("val")});
            });
            localStorage.grupos = JSON.stringify(grupos_list, 2, 2);
            var fuent = document.querySelectorAll("#fuente_input")[0].value;
            localStorage.fuente = fuent;
            fuente_value = fuent;
            var data = [];
            _().each(document.querySelectorAll("#attr-grupos ul>li div"),function(i,a){
               values = [];
               var grupo = $(a[i]).parent().parent().parent().find("span").text();
            _().each(a[i].childNodes,function(j,c){
                values.push(c[j].value);
              });
                if(values[2])color = values[2];
                else if(i>=colores.length){
                    colores[(i%colores.length)+2] = new Color(values[2]);
                    color = colores[(i%colores.length)+2].hex;
                }
                else{
                    colores[i] = new Color(values[2]);
                    color = colores[i].hex
                }
              data[i] = {
                    label:values[0],
                    value: parseFloat(values[1]),
                    group: grupo,
                    color: color,
                };
           });
            localStorage.data = JSON.stringify(data, 2, 2);
             dragevents();
            _("#graph").pie({data:data});
        },false);
    grupos.appendChild(inpt_sub);
    f.appendChild(grupos);
    f.appendChild(div_options);
    contenedor.appendChild(f);
    dest.appendChild(contenedor);
}

_.prototype.pie= function (obj) {
    var id = this.id;
    
    _().canvas(this.e[0],function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.addPieTools();
        this.drawPie(this.canvas,obj.data); 
    });
    
    
}

_.prototype.pie_type_menu = function() {
    var dest = Array.prototype.slice.call(this.e);
    console.log("noo");
    var compuestoGrahp = document.createElement("LI");
        compuestoGrahp.innerHTML = "Compuesto<div class='icon-spinner2 icono' title='Gráfico compuesto'></div>";
        compuestoGrahp.setAttribute("id","pie_complex");
        compuestoGrahp.setAttribute("tipo","Compuesto");

    var simple = document.createElement("LI");
        simple.innerHTML = "Gráfico simple<div class='icon-spinner icono' title='Gráfico simple'></div>";
        simple.setAttribute("id","pie_simple");
        simple.setAttribute("tipo","Simple");


    (dest).forEach( function(t){
        t.innerHTML = "";
        t.appendChild(compuestoGrahp);
        t.appendChild(simple);
    });
    return this;

}

_.prototype.addPieTools = function (obj) {
    var menu = document.querySelectorAll("menu")[0];
    menu.innerHTML = "";
    var f = document.createDocumentFragment();
    var complex = document.createElement("DIV");

    complex.innerHTML = "<div class='icon-spinner2 icono' title='Gráfico compuesto'></div><span class='menu-text'>Gráfico compuesto</span>";
    if(pie_mode == "complex")complex.className = "active menu-button";
    else complex.className = "menu-button";
    complex.setAttribute("id","pie_complex");
    var simple = document.createElement("DIV");
    if(pie_mode == "simple")simple.className = "active menu-button";
    else simple.className = "menu-button";
    simple.innerHTML = "<div class='icon-spinner icono' title='Gráfico simple'></div><span class='menu-text'>Gráfico simple</span>";
    simple.setAttribute("id","pie_simple");
    f.appendChild(simple);
    f.appendChild(complex);
    menu.appendChild(f);

    var data_content = document.querySelectorAll("#graph-data")[0];
    var f = document.createDocumentFragment();
    var complex = document.createElement("DIV");
    complex.setAttribute("id","attributes-pannel");
    f.appendChild(complex);
    data_content.appendChild(f);
}

_.prototype.draw = function (data, radio, text) {
    var suma = 0;
    var porciones = Array();
    
    _().each(data,function(i){
        suma += data[i]["value"];
    });
    
    
    _().each(data,function (i) {
        if (localStorage.data && JSON.parse(localStorage.data)[i]["color"])
            var color = new Color(JSON.parse(localStorage.data)[i]["color"]);
        else {
            if(i>=colores.length){
                var color = colores[(i%colores.length)+2];
            }
            else var color=colores[i];
        }
        var p = ( data[i]["value"] * 100 / suma)*( Math.PI*2/100);
        porciones.push({
            porcentaje : p,
            color: color});
    });
    for ( var i = 0; i < data.length; i++) {
        this.drawPieSegment(this.ctx, i,porciones,radio);
    }
    if (text) {
        for ( var i = 0; i < data.length; i++) {
            this.writePieText(this.ctx, i,porciones,radio);
        }
    }
    else {
        for ( var i = 0; i < data.length; i++) {
            this.drawPieGroupText(this.ctx, i,porciones,radio+130);
        }
    }
}

_.prototype.drawPie = function (canvas, data) {
    this.data = data;
    create_data_set(this.data_content,data);
    this.ctx = canvas.getContext("2d");
    var radio = 0;
    if (pie_mode=="complex" && localStorage.grupos) {
        this.grupos = JSON.parse(localStorage.grupos);
        var grupos = this.grupos;
        var fragmentos = [];
        var total = 0;
        _().each(this.grupos,function(i,g){
            _().each(data, function(d){
                if(data[d].group == grupos[i].label){
                    total += data[d].value;
                }
            });
            g[i].value = total;
            if(total > 0)
                fragmentos.push({value: total, label: grupos[i].label});
            total = 0;
        });
        this.draw(fragmentos,180,false);
        radio = 180;
        localStorage.grupos = JSON.stringify(fragmentos);
    }
    else {
        radio = 200;
    }

    var fuente = new Kinetic.Text({
            x: canvas.width - 20,
            y: canvas.height - 5 ,
            text: "Fuente: "+fuente_value,
            fontSize: 15,
            fontFamily: "infotext,Helvetica,arial,InfoTextBook",
            fontStyle: "italic",
            fill: "#7B796C",
            rotationDeg: -90,
        });
    _.layer.add(fuente);
    this.draw(data, radio-20, true);

}
_.prototype.sumTo = function (a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
        sum += a[j]["porcentaje"];    	
    }
    return sum;
}

_.prototype.drawPieSegment = function (context, i, porciones, r) {
    var startingAngle = (this.sumTo(porciones, i));
    var arcSize = porciones[i]["porcentaje"];
    var endingAngle = startingAngle + arcSize;
    console.log(porciones[i]["color"] );
    if(typeof porciones[i]["color"] === "undefined")localStorage.clear();
    var arc = new Kinetic.Shape({
        drawFunc: function(context){
            var centerX = Math.floor(context.canvas.width/2);
            var centerY = Math.floor(context.canvas.height/2);
            radius = r;
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.arc(centerX, centerY, radius, 
                        startingAngle, endingAngle, false);
            context.closePath();
            context.fillStrokeShape(this);
        },
        fill: porciones[i]["color"].hex,
        stroke: "#FFF",
        strokeWidth: 1,
    });
    _.layer.add(arc);
    _.layer.draw();
}

_.prototype.drawPieGroupText = function (context, i, porciones, r) {
    var centerx = Math.floor(context.canvas.width/2);
    var centery = Math.floor(context.canvas.height/2);
    radius = r+20;
    var tc;
    if(porciones[i]["color"].lab.l < 65)tc = "#FFF";
    else tc = "#333";
    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"]-0.35;
    var endingAngle = (startingAngle + arcSize/2);

    var dy = Math.sin(endingAngle) / 2;
    var dx = 2 * Math.cos(endingAngle) / 3;
    context.font = '16px "Mic 32 New Rounded",mic32newrd';
    var width = context.measureText( this.grupos[i]["label"]).width;

    context.fillStyle = "#FFF";

    var group = new Kinetic.Group({
        draggable:true,
        dragBoundFunc: function(pos,e) {
            var centerX = context.canvas.width/2;
            var centerY = (context.canvas.height/2);
                r = radius - 20;
            if(typeof e != "undefined"){

            var x = centerX - e.offsetX;
            var y = centerY - e.offsetY;
            if((x*x)+(y*y) > (r*r)){
                text_data.setFill("#333");
            }else{
                text_data.setFill(tc);
            }
            }
            _.layer.draw();
            return pos;
        },
        id: "pie_text_"+i,
        name: "label",
    }
                                 );
    var box = new Kinetic.Rect({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius),
            width: width+22,
            height: 20,
            fill: "#000",
        });
    var text_label = new Kinetic.Text({
            x: centerx + (dx*radius) +5,
            y: centery+ (dy*radius) ,
            text: this.grupos[i]["label"],
            fontSize: 16,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            fill: "#fff",
            padding: 2,
            paddingLeft: -5,
        });

    var text_data = new Kinetic.Text({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius) + 24,
            fontSize: 12,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            text: this.grupos[i]["value"]+"%",
            fill: tc,
            padding: 1,
        });
    group.add(box);
    group.add(text_label);
    group.add(text_data);
    _.layer.add(group);
    _.layer.draw();
}
_.prototype.writePieText = function (context, i, porciones, r) {
    var centerx = Math.floor(context.canvas.width/2);
    var centery = Math.floor(context.canvas.height/2);
    radius = r+20;

    var tc;
    if (porciones[i]["color"].lab.l < 65) tc = "#FFF";
    else tc = "#333";
    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"]-0.35;
    var endingAngle = (startingAngle + arcSize/2);

    var dy = Math.sin(endingAngle)/2;
    var dx = 2*Math.cos(endingAngle)/3; 
    context.font = '16px "Mic 32 New Rounded",mic32newrd';
    var width = context.measureText( this.data[i]["label"]).width;

    context.fillStyle = "#FFF";	

    var group = new Kinetic.Group({
        draggable:true,
        dragBoundFunc: function(pos,e) {
        var centerX = context.canvas.width/2;
        var centerY = (context.canvas.height/2);
            r = radius - 20;
        if(typeof e != "undefined"){

        var x = centerX - e.offsetX;
        var y = centerY - e.offsetY;
        if((x*x)+(y*y) > (r*r)){
            text_data.setFill("#333");
        }else{
            text_data.setFill(tc);
        }
        }
        _.layer.draw();
            return pos;
        }, 
        id: "pie_text_"+i,
        name:"label",
    });

    /* Split the labels in lines and get the box size  */

    var width = context.measureText( this.data[i]["label"]).width;
    var t =  this.data[i]["label"];
    var texto = "",w = 0, l1 = 80, l2 = 110,ancho=0,lineas = 1;
    var mayor = 0;

    _().each(t.split(" "), function (k, te) {   // Iterate through each word
       w=context.measureText(te[k]).width;      // get each word width
        if ( mayor < ancho ) mayor = ancho;     // check if the current line width is the longest and if so change it
        if ((ancho + w) > l1) {                 // if the current line plus the word is longer than the first control limit
         if ((ancho + w) > l2) {                // check if its greater than the longest limit
             texto += "\n"+te[k]+" ";           // if so, break the line and add the word
             if (k != te.length-1) ancho=0;     // if its not the last word reset the line width to 0
             else ancho = l1;                   // else, set it to the first limit
             lineas++                           // increase the number of lines written
         }
         else {
            texto+=te[k]+" ";                   // if its smaller than the last limit just add it
            ancho += w;                         // increase the line width
         }
       }
       else {
            texto += te[k] + " ";               // if its smaller than the first limit add it
            ancho += w;                         // increase the line width
       }
    });

    if (lineas > 1) width = mayor;              // if there's more than one line set the width to the greatest line width
    var padding = 20*lineas;

    var box = new Kinetic.Rect({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius),
            width: width+22,
            height: padding,
            fill: "#000",
        });

    var text_label = new Kinetic.Text({
            x: centerx + (dx*radius) +5,
            y: centery+ (dy*radius) ,
            text: texto,
            fontSize: 16,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            fill: "#fff",
            padding: 2,
            paddingLeft: -5,
        });
    
    var text_data = new Kinetic.Text({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius) + padding+4,
            fontSize: 12,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            text: this.data[i]["value"]+"%",
            fill: tc,
            padding: 1,
        });


    group.add(box);
    group.add(text_label); 
    group.add(text_data);

    _.layer.add(group);

    var labels = _.layer.find('.label');
    labels.forEach(function(i){
        i.setZIndex(50);
    });

    _.layer.draw();
}
