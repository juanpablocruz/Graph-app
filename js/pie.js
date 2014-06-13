var tartas = 1;
var pie_mode = "simple";
"use strict";
var fuente_value = "Fuente: Cores";
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

    _().each( document.querySelectorAll(".grupo_tag"), function(i,a) {     // Fetch all the data inside each item
        grupos_list.push({
            label:a[i].innerHTML,value:a[i].getAttribute("val"),
            color:$(a[i].nextSibling).find(".color_selector").attr("value")
        });
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
        if (values[2])color = $(values[2]).find(".color_selector").attr("value");
        else
            if (i>=colores.length){
                colores[(i%colores.length)+2] = new Color($(values[2]).find(".color_selector").attr("value"));
                if( typeof colores[(i % colores.length) + 2] === "undefined") {
                    colores[(i%colores.length)+2]  = new Color("#000000");
                }
                color = colores[(i%colores.length) + 2].hex;
            }
            else {
                colores[i] = new Color($(values[2]).find(".color_selector").attr("value"));
                if(typeof colores[i] === "undefined") colores[i]  = new Color("#000000");
                color = colores[i].hex;
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
                    if(typeof colores[(i%colores.length)+2] === "undefined")
                        colores[(i%colores.length)+2] = new Color("#000000");
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

        if(pie_mode == "simple") {
           li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie simple_pie' val='0'>Grupo1</span>";
        } else {
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

    // HOME OPTION CHECKBOX

    var checkbox_labels_home = document.createElement("input");
        checkbox_labels_home.type = "checkbox";
        checkbox_labels_home.setAttribute("id","home-check");

    var checkbox_title_home = document.createElement("label");
        checkbox_title_home.setAttribute("for","home-check");
        checkbox_title_home.setAttribute("class","label-home-check");
        checkbox_title_home.innerHTML = "Para home";
        checkbox_labels_home.checked = false;
    if(localStorage.homeMode) {
        checkbox_labels_home.checked = (localStorage.homeMode==="false")?false:true;
    }

    $(checkbox_labels_home).on("change",function() {
        this.home = $("#home-check").is(":checked");
        localStorage.homeMode = this.home;
    });
    var checkbox_home = $("<div class='checkhome'></div>");
    $(checkbox_home).append(checkbox_labels_home);
    $(checkbox_home).append(checkbox_title_home);

    // LITLE HOME CHECKBOX

    var checkbox_labels_little = document.createElement("input");
        checkbox_labels_little.type = "checkbox";
        checkbox_labels_little.setAttribute("id","home-litle-check");

    var checkbox_title_little = document.createElement("label");
        checkbox_title_little.setAttribute("for","home-litle-check");
        checkbox_title_little.setAttribute("class","label-home-litle-check");
        checkbox_title_little.innerHTML = "Pequeño";
        checkbox_labels_little.checked = false;
    if(localStorage.homeModeLitle) {
        checkbox_labels_little.checked = (localStorage.homeModeLitle==="false")?false:true;
    }

    $(checkbox_labels_little).on("change",function() {
        this.home_litle = $("#home-litle-check").is(":checked");
        localStorage.homeModeLitle = this.home_litle;
    });

    var checkbox_little = $("<div class='checkhome'></div>");
    $(checkbox_little).append(checkbox_labels_little);
    $(checkbox_little).append(checkbox_title_little);

    //

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
    $(div_options).append(checkbox_home);
    $(div_options).append(checkbox_little);
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

        if(localStorage.homeMode)
            this.home = localStorage.homeMode;
        else
            this.home = false;
        if(localStorage.homeModeLitle)
            this.home_litle = localStorage.homeModeLitle;
        else
            this.home_litle = false;

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

    if(pie_mode == "simple")
        simple.className = "active menu-button";
    else
        simple.className = "menu-button";

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
        radio = (this.home === "true")?(this.home_litle === "true")? 220:140:200;
    }

    var fuente = new Kinetic.Text({
            x: canvas.width - 20,
            y: canvas.height - 5 ,
            text: fuente_value,
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
        var font_size = (localStorage.homeMode == "true")? {t:28,p:26} : {t:16,p:12};

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

    context.fillStyle = "#FFF";
    var texto = (Math.round(10*((porciones[i]["porcentaje"]*180/Math.PI)*100/360))/10);
    if(texto > 100) texto = 100;

    var group = new Kinetic.Group({
        draggable:true,
        dragBoundFunc: function(pos,e) {
                var centerX = context.canvas.width/2;
                var centerY = (context.canvas.height/2);
                var r1 = radius+20;
                if(typeof e != "undefined"){

                var x = centerX - (e.offsetX);
                var y = centerY - (e.offsetY);
                if((x*x)+(y*y) > (r1*r1)){
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
    });

    var x = centerx + (dx*radius);
    if ( x > centerx*2) x = (centerx*2)-50;
    var font_size = (this.home === "true")? {t:24,p:24} : {t:16,p:14};

    var width = (font_size.p == 24)?
        (context.measureText( this.grupos[i]["label"]).width * 3/2)+15:
        context.measureText( this.grupos[i]["label"]).width + 15;

    var hplus = (font_size.p == 24)? 2 : 0;
    var box = new Kinetic.Rect({
            x: x,
            y: centery+ (dy*radius),
            width: width,
            height: 22+hplus,
            fill: this.grupos[i]["color"],
        });
    var text_label = new Kinetic.Text({
            x: x +5,
            y: centery+ (dy*radius) ,
            text: this.grupos[i]["label"],
            fontSize: font_size.t,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            fill: "#fff",
            padding: 2,
            paddingLeft: -5,
        });

    var text_data = new Kinetic.Text({
            x: x,
            y: centery+ (dy*radius) + 24 +hplus,
            fontSize: font_size.p,
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

var total_angle=0;

_.prototype.writePieText = function (context, i, porciones, r) {
    var centerx = Math.floor(context.canvas.width/2);
    var centery = Math.floor(context.canvas.height/2);
    var radius = r;

    var tc;
    try {
        if (porciones[i%porciones.length]["color"].lab.l < 65) tc = "#FFF";
        else tc = "#333";
    } catch(e) {
        tc = "#333";
    }

    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"];
    var endingAngle = (startingAngle + arcSize/2)-Math.PI/2;

    var dy = 2*(Math.sin(endingAngle))/3;
    var dx = 2*(Math.cos(endingAngle))/3;

    context.font = '16px "Mic 32 New Rounded",mic32newrd';

    context.fillStyle = "#FFF";

    var font_size = (this.home === "true")? {t:24,p:24} : {t:16,p:14};
    context.fontSize = font_size.t;
    var etiqueta = this.splitLabels (this.data[i]["label"], context, 80, 110);
    var texto = etiqueta.texto;

    var width = (font_size.p == 24)? (etiqueta.width * 3/2) + 15:etiqueta.width + 15;

    var padding = etiqueta.padding;
    if (font_size.t == 24) padding *= 3/2;

    /*
        LABEL DRAWING
        First case is home with lines
    */
    if ((localStorage.homeMode === "true") && (localStorage.homeModeLitle === "false")) {
        // We first create a line with two points, label start and origin position.
        var line = new Kinetic.Line({
            points:[(centerx)+ (dx*radius)+50,(centery)+ (dy*radius)+5,
                    (centerx)+ (dx*radius),(centery)+ (dy*radius)+5],
            stroke: "#666",
            strokeWidth: 1,
        });
        // Cache the initial position of the label to compare with
        var objectPos = {x: centerx + (dx * radius), y: centery + (dy * radius)};

        var group = new Kinetic.Group({
            draggable:true,
            dragBoundFunc: function(pos,e) {
                // Final point of the line
                var endX = (centerx)+ ((dx)*(radius+60));
                var endY = (centery)+ ((dy)*(radius+60));
                var r1 = radius;
                // Current position of the label
                var posit = this.getAbsolutePosition();

                if(typeof e != "undefined"){
                    // We first check if the label is inside the pie and if so keep the color
                    // if not set black
                    var x = (context.canvas.width / 2) - e.offsetX;
                    var y = (context.canvas.height / 2) - e.offsetY;

                    if((x * x) + (y * y) > (r1 * r1)) text_data.setFill("#333");
                    else    text_data.setFill(tc);

                    // angle_base is for calculate the pitched line width
                    var angle_base = 20;
                    if (e.offsetX - (width/2) > endX) {
                        // if the label is closer than 20, set angle_base to the difference
                        if ( ( objectPos.x + posit.x - 5 ) - endX < angle_base )
                            angle_base = ( objectPos.x + posit.x - 5 ) - endX;
                        // update the line points, first point is the start at the label
                        // second is the line from start to the begining of the pitched line
                        // third is the pitched line, the line which starts at the height of the label
                        // and ends in the point of the pie.
                        line.setPoints([{x: objectPos.x + posit.x - 5, y: objectPos.y + posit.y + 20},
                                        {x: endX + angle_base, y: objectPos.y + posit.y + 20},
                                        {x: endX, y: endY}]);
                    } else {
                        if ( endX - ( objectPos.x + posit.x + width ) < angle_base )
                            angle_base = endX - ( objectPos.x + posit.x + width );

                        line.setPoints([
                            {x: objectPos.x + posit.x + width, y: objectPos.y + posit.y + 20},
                            {x: endX - angle_base, y: objectPos.y + posit.y + 20},
                            {x: endX, y: endY}]);
                    }
                }
                return pos;
            },
            id: "pie_text_" + i,
            name:"label",
        });

        var box = new Kinetic.Rect({
            x: objectPos.x,
            y: objectPos.y,
            width: width,
            height: padding,
        });
        var text_label = new Kinetic.Text({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius) ,
            text: texto,
            fontSize: font_size.t,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            fill: "#000",
            padding: 2,
            paddingLeft: -5,
        });

        var text_data = new Kinetic.Text({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius) + padding-4,
            fontSize: font_size.p,
            fontFamily: "'Mic 32 New Rounded',mic32newrd",
            text: (Math.round(10*((porciones[i]["porcentaje"]*180/Math.PI)*100/360))/10)+"%",
            fill: tc,
            padding: 1,
        });
    } else {
        // this case is for pies whitout lines, be they the small ones or the home ones
        var group = new Kinetic.Group({
            draggable:true,
            dragBoundFunc: function(pos,e) {
                var centerX = context.canvas.width/2;
                var centerY = (context.canvas.height/2);
                var r = radius - 20;
                // Just check if the label is in the pie for color changing
                if(typeof e != "undefined"){
                    var x = centerX - e.offsetX;
                    var y = centerY - e.offsetY;
                    if( (x * x) + (y * y) > (r * r) ) {
                        text_data.setFill("#333");
                    } else {
                        text_data.setFill(tc);
                    }
                }
                _.layer.draw();
                    return pos;
            },
            id: "pie_text_"+i,
            name:"label",
        });

        var box = new Kinetic.Rect({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius),
            width: width,
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

    }

    total_angle += endingAngle;

    group.add(box);
    group.add(text_label);
    group.add(text_data);

    _.layer.add(group);
    if((localStorage.homeMode === "true") && (localStorage.homeModeLitle === "false")) _.layer.add(line);

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
