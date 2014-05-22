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

function draw_action() {
    var grupos_list = [];
    _().each(document.querySelectorAll(".grupo_tag"),function(i,a){     // Fetch all the data inside each item
        grupos_list.push({label:a[i].innerHTML,value:a[i].getAttribute("val"),
                          color:$(a[i].nextSibling).find(".color_selector").attr("value")});
    });
    localStorage.grupos = JSON.stringify(grupos_list);
    var fuent = document.querySelectorAll("#fuente_input")[0].value;
    localStorage.fuente = fuent;
    fuente_value = fuent;
    var data = [];
    _().each(document.querySelectorAll("#attr-grupos ul>li .data-list-element"),function(i,a){
       values = [];
       var grupo = $(a[i]).parent().parent().parent().find("span").text();
        _().each(a[i].childNodes,function(j,c){
            if(j == 2) {
                values.push(c[j]);
            }
            else values.push(c[j].value);
        });
        if(values[2])color = $(values[2]).find(".color_selector").attr("value");
        else if(i>=colores.length){
            colores[(i%colores.length)+2] = new Color($(values[2]).find(".color_selector").attr("value"));
            if(typeof colores[(i%colores.length)+2] === "undefined")colores[(i%colores.length)+2]  = new Color("#000000");
            color = colores[(i%colores.length)+2].hex;
        }
        else{
            colores[i] = new Color($(values[2]).find(".color_selector").attr("value"));
            if(typeof colores[i] === "undefined")colores[i]  = new Color("#000000");
            color = colores[i].hex
        }

      data[i] = {
            label:values[0],
            value: parseFloat(values[1]),
            group: grupo,
            color: color,
        };
    });
    localStorage.data = JSON.stringify(data);
    var custom_tags = [];
    _().each(document.querySelectorAll("#add-label ul li .new-label"), function(i,a) {
        if(a[i].value != "")
            custom_tags.push(a[i].value);
    });

    localStorage.customTags = JSON.stringify(custom_tags);
    dragevents();
    _("#graph").pie({data:data});

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
    //TODO: Añadir borrar grupo
    if (localStorage.grupos && localStorage.grupos != "[]" && pie_mode === "complex") {
        var g = JSON.parse(localStorage.grupos);
        _().each(g, function (j, a) {                                   //create each group
            var li = document.createElement("LI");
            li.className = "sortable-group-list";
            if (pie_mode === "simple")
                li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie simple_pie '>" + a[j].label + "</span>";
            else {
                li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie'>" + a[j].label + "</span>";
                if(a[j].color != "")
                    clinpt(li).input(a[j].color);
                else {
                    clinpt(li).input(colores[j%colores.length].hex);
                    a[j].color = colores[j%colores.length].hex;
                }
            }
            var ul2 = document.createElement("UL");

            $(".sortable-group-list > ul").sortable({
                connectWith: ".sortable-group-list > ul",
                dropOnEmpty: true,
                forceHelperSize: true,
                forcePlaceholderSize: true
            }).disableSelection();

            _().each(d, function (i) {                                  // Create each portion in its own group

                if (d[i].group !== "" && d[i].group === a[j].label) {
                    if(d[i]["color"])color = d[i]["color"];
                else if(i>=colores.length){
                    if(typeof colores[(i%colores.length)+2] === "undefined")colores[(i%colores.length)+2] = new Color("#000000");
                    var color = colores[(i%colores.length)+2].hex;
                }
                else{
                    if(typeof colores[i] === "undefined")colores[i] = new Color("#000000");
                    var color=colores[i].hex;
                }

                var li2 = document.createElement("LI");
                li2.className = "data-list-li";
                var cont = document.createElement("DIV");
                cont.className = "data-list-element icon-reorganizar";
                var inpt_val = document.createElement("INPUT");
                inpt_val.type = "number";
                inpt_val.value = d[i]["value"];
                inpt_val.className = "value";
                var inpt_labl = document.createElement("INPUT");
                inpt_labl.type = "text";
                inpt_labl.value = d[i]["label"];
                inpt_labl.className = "label";
                var close_div = document.createElement("DIV");
                close_div.className = "remove-list-item";

                cont.appendChild(inpt_labl);
                cont.appendChild(inpt_val);
                clinpt(cont).input(color);
                li2.appendChild(cont);
                li2.appendChild(close_div);
                ul2.appendChild(li2);
                }
            });
            li.appendChild(ul2);
            ul.appendChild(li);
            grupos.appendChild(ul);

        });
    }
    else{                                               // If there's no groups create one and add everything in
        var li = document.createElement("LI");
        li.className = "sortable-group-list";
        if(pie_mode == "simple")
           li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie simple_pie' val='0'>Grupo1</span>";
        else {
            li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie' val='0'>Grupo1</span>";
        }

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
            cont.className = "data-list-element icon-reorganizar";
            var inpt_val = document.createElement("INPUT");
            inpt_val.type = "number";
            inpt_val.value = d[i]["value"];
            inpt_val.className = "value";
            var inpt_labl = document.createElement("INPUT");
            inpt_labl.type = "text";
            inpt_labl.value = d[i]["label"];
            inpt_labl.className = "label";

            var close_div = document.createElement("DIV");
            close_div.className = "remove-list-item";

            cont.appendChild(inpt_labl);
            cont.appendChild(inpt_val);

            clinpt(cont).input(color);
            li2.appendChild(cont);
            li2.appendChild(close_div);
            ul2.appendChild(li2);

            $(".sortable-group-list > ul").sortable({
                start: function (event, ui) {
                    item = ui.item;
                    newList = oldList = ui.item.parent();
                },
                stop: function (event, ui) {

                // perform action here

                },
                change: function (event, ui) {
                    if (ui.sender) newList = ui.placeholder.parent();
                },
                connectWith: ".sortable-group-list > ul",
                dropOnEmpty: true
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

    var add_label = $("<div id='add-label'></div>");
    var label_span = $("<button id='add-label-button' class='draw_button'>Crear etiqueta</button>");
    var label_list = $("<ul></ul>");
    $(label_list).html("");
    if (localStorage.customTags) {
        var custom_tags = JSON.parse(localStorage.customTags);
        _().each(custom_tags, function(i,a) {
            $(label_list).append("<li><div class='new-label-div'>\
                                    <input type='text' class='new-label' placeholder='Etiqueta' value='"+a[i]+"'/></div>\
                                    <div class='remove-list-item'></div>\
                                    </li>");
        });
    }
    $(add_label).append(label_span);
    $(add_label).append(label_list);
    $(div_options).append(add_label);

    $(document).on("click","#add-label-button", function() {
        $(label_list).append("<li><div class='new-label-div'>\
                                    <input type='text' class='new-label' placeholder='Etiqueta'/></div>\
                                    <div class='remove-list-item'></div>\
                                    </li>");
    });

    var inpt_sub = document.createElement("BUTTON");                            // Create draw button
        inpt_sub.type = "submit";
        inpt_sub.innerHTML = "Dibujar<div class='icon-pencil icono'></div> ";
        inpt_sub.className = "draw_button";
        inpt_sub.addEventListener('click',draw_action,false);
    grupos.appendChild(inpt_sub);
    f.appendChild(grupos);
    f.appendChild(div_options);
    contenedor.appendChild(f);
    dest.appendChild(contenedor);
    dragevents();
}

_.prototype.pie= function (obj) {
    var id = this.id;
    _().createCanvas(this.e[0],function() {
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.addPieTools();
        this.drawPie(this.canvas,obj.data);
        clinpt().loadFunctions();
    });


}

_.prototype.pie_type_menu = function() {
    var dest = Array.prototype.slice.call(this.e);
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
        if (localStorage.data && JSON.parse(localStorage.data)[i]["color"] && text){
            var color = new Color(JSON.parse(localStorage.data)[i]["color"]);
        }
        else if (!text && pie_mode=="complex" && localStorage.grupos){
            var c = JSON.parse(localStorage.grupos)[i]["color"];
            if ( c === "" ) var color=colores[i];
            else var color=new Color(c);
        }
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
            g[i].value = Math.round(total*100)/100;
            if(total > 0) {
                fragmentos.push({value: total, label: grupos[i].label, color: grupos[i].color});
            }
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
            name: "fuente",
        });
    _.layer.add(fuente);

    this.draw(data, radio-20, true);
    if(localStorage.customTags) {
        var custom_tags = JSON.parse(localStorage.customTags);
        var layer2 = new Kinetic.Layer();
        var ctx = this.ctx;
        var font_size = (JSON.parse(localStorage.dimensiones).width == "ancho")? {t:28,p:26} : {t:16,p:12};

        _().each(custom_tags, function(i,a) {
            var group = new Kinetic.Group({
                draggable:true,
                id: "group_label",
                name:"label"
            });

            var text = new Kinetic.Text({
                x: 10,
                y: 12,
                fontSize: font_size.t,
                fontFamily: "'Mic 32 New Rounded',mic32newrd",
                text: a[i],
                fill: "black",
                padding: 2,
            });

            var font = ctx.font;
            ctx.font = "'Mic 32 New Rounded',mic32newrd'";
            ctx.fontSize = font_size.t;
            var lwidth = ctx.measureText(a[i]).width;
            if (font_size.t > 16) var lw = lwidth + (font_size.t * 2)+ 5;
            else var lw = lwidth + 5;
            var box = new Kinetic.Rect({
                x: 10,
                y: 10,
                width: lw,
                height: font_size.t + 4,
                fill: "#d3cdc7",
            });
            ctx.font = font;
            group.add(box);
            group.add(text);
            layer2.add(group);

        });
        var labels = layer2.find('.label');
        labels.forEach(function(i){
            i.setZIndex(50);
        });
        this.stage.add(layer2);
        layer2.draw();
    }
}
_.prototype.sumTo = function (a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
        sum += a[j]["porcentaje"];
    }
    return sum;
}

_.prototype.drawPieSegment = function (context, i, porciones, r) {
    var startingAngle = (this.sumTo(porciones, i))-Math.PI/2;
    var arcSize = porciones[i]["porcentaje"];
    var endingAngle = startingAngle + arcSize;
    var hex = "black";
    try {
        hex = porciones[i%porciones.length]["color"].hex;
    } catch (e) {
        console.log("Error accediendo al color "+i);
    }
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
        fill: hex,
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
    if(porciones[i%porciones.length]["color"].lab.l < 65)tc = "#FFF";
    else tc = "#333";
    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"]-0.35;
    var endingAngle = (startingAngle + arcSize/2)-Math.PI/2;

    var dy = Math.sin(endingAngle) / 2;
    var dx = 2 * Math.cos(endingAngle) / 3;
    context.font = '16px "Mic 32 New Rounded",mic32newrd';
    var width = context.measureText( this.grupos[i]["label"]).width;

    context.fillStyle = "#FFF";
    var texto = (Math.round(10*((porciones[i]["porcentaje"]*180/Math.PI)*100/360))/10);
    if(texto > 100) texto = 100;

    var group = new Kinetic.Group({
        draggable:true,
        dragBoundFunc: function(pos,e) {
            var centerX = context.canvas.width/2;
            var centerY = (context.canvas.height/2);
                r = radius+20;
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
    var x = centerx + (dx*radius);
    if ( x > centerx*2) x = (centerx*2)-50;
    var box = new Kinetic.Rect({
            x: x,
            y: centery+ (dy*radius),
            width: width+22,
            height: 20,
            fill: "#000",
        });
    var text_label = new Kinetic.Text({
            x: x +5,
            y: centery+ (dy*radius) ,
            text: this.grupos[i]["label"],
            fontSize: 16,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            fill: "#fff",
            padding: 2,
            paddingLeft: -5,
        });

    var text_data = new Kinetic.Text({
            x: x,
            y: centery+ (dy*radius) + 24,
            fontSize: 12,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            text: texto+"%",
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
    try {
        if (porciones[i%porciones.length]["color"].lab.l < 65) tc = "#FFF";
        else tc = "#333";
    } catch(e) {
        tc = "#333";
    }
    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"]-0.35;
    var endingAngle = (startingAngle + arcSize/2)-Math.PI/2;

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

/*    var width = context.measureText( this.data[i]["label"]).width;
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
    var padding = 20*lineas;*/


    //var font_size = {t:16,p:12};
    var font_size = (JSON.parse(localStorage.dimensiones).width == "ancho")? {t:24,p:24} : {t:16,p:14};
    context.fontSize = font_size.t;
    var etiqueta = this.splitLabels (this.data[i]["label"], context, 80, 110);
    var texto = etiqueta.texto;
    var width = etiqueta.width *3/2;
    var padding = etiqueta.padding;
    if(font_size.t == 24) padding *= 3/2;

    var box = new Kinetic.Rect({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius),
            width: width + 12,
            height: padding,
            fill: "#000",
        });


    var text_label = new Kinetic.Text({
            x: centerx + (dx*radius) +5,
            y: centery+ (dy*radius) ,
            text: texto,
            fontSize: font_size.t,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            fill: "#fff",
            padding: 2,
            paddingLeft: -5,
        });

    var text_data = new Kinetic.Text({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius) + padding+4,
            fontSize: font_size.p,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            text: (Math.round(10*((porciones[i]["porcentaje"]*180/Math.PI)*100/360))/10)+"%",
            fill: tc,
            padding: 1,
        });
    group.add(box);
    group.add(text_label);
    group.add(text_data);

    _.layer.add(group);

    var fuente = _.layer.find('.fuente');
    fuente.forEach(function(i){
        i.setZIndex(50);
    });

    var labels = _.layer.find('.label');
    labels.forEach(function(i){
        i.setZIndex(50);
    });

    _.layer.draw();
}
