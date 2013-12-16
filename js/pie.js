var tartas = 1;
var pie_mode = "simple";
if(!localStorage.pie_mode)
    localStorage.pie_mode = "simple";
else{
    pie_mode = localStorage.pie_mode;
}
function create_data_set(dest,d){
    dest.innerHTML = "";
    var f = document.createDocumentFragment();
    var contenedor = document.createElement("DIV");
    contenedor.setAttribute("id","data-list");

    var f = document.createDocumentFragment();
    
    var create = document.createElement("BUTTON");
    create.setAttribute("id","create-group");
    if(pie_mode == "simple")
        create.className = "complex_pie simple_pie";
    else
        create.className = "complex_pie";
    create.innerHTML = "Añadir Grupo";
    var grupos = document.createElement("DIV");
    grupos.setAttribute("id","attr-grupos");
    var ul = document.createElement("UL");
    grupos.appendChild(create);
    if(localStorage.grupos){
    var g = JSON.parse(localStorage.grupos);
    
    _().each(g,function(j,a){
        var li = document.createElement("LI");
        if(pie_mode == "simple")
            li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie simple_pie'>"+a[j].label+"</span>";
        else
            li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie'>"+a[j].label+"</span>";
        var ul2 = document.createElement("UL");
        $(li).droppable({
                addClasses : false,
                accept: ".data-list-li",
                drop: function(e,ui){
                    $(this).find("ul").append(ui.draggable)
                }
            });
        _().each(d,function(i){
            if(d[i].group != "" && d[i].group == a[j].label){
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
    else{
        var li = document.createElement("LI");
        if(pie_mode == "simple")
           li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie simple_pie' val='0'>Grupo1</span>";
        else
            li.innerHTML = "<span contenteditable='true' class='grupo_tag complex_pie' val='0'>Grupo1</span>";
        var ul2 = document.createElement("UL");

        _().each(d,function(i,a){
            console.log(d[i]["color"]);
            if(d[i]["color"]){
                color = d[i]["color"];
                console.log(color);
            }
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

        });
        li.appendChild(ul2);
        ul.appendChild(li);
        grupos.appendChild(ul);
    }



    var inpt_sub = document.createElement("BUTTON");
        inpt_sub.type = "submit";
        inpt_sub.innerHTML = "Dibujar<div class='icon-pencil icono'></div> ";
        inpt_sub.className = "draw_button";
        inpt_sub.addEventListener('click',function(){
            var grupos_list = [];
            _().each(document.querySelectorAll(".grupo_tag"),function(i,a){
                grupos_list.push({label:a[i].innerHTML,value:a[i].getAttribute("val")});
            });
            localStorage.grupos = JSON.stringify(grupos_list, 2, 2);

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
    contenedor.appendChild(f);
    dest.appendChild(contenedor);
}
_.prototype.pie= function(obj){
    var id = this.id;
    
    _().canvas(this.e[0],function(){
        this.data_content = document.querySelectorAll("#graph-data")[0];
        this.canvas = document.querySelectorAll(id+" canvas")[0];
        this.addTools();
        this.drawPie(this.canvas,obj.data); 
    });
    
    
}
_.prototype.addTools = function(obj){
    var menu = document.querySelectorAll("menu")[0];
    menu.innerHTML = "";
    var f = document.createDocumentFragment();
    var complex = document.createElement("DIV");

    complex.innerHTML = "<div class='icon-spinner2 icono'></div>  Gráfico compuesto";
    if(pie_mode == "complex")complex.className = "active menu-button";
    else complex.className = "menu-button";
    complex.setAttribute("id","pie_complex");
    var simple = document.createElement("DIV");
    if(pie_mode == "simple")simple.className = "active menu-button";
    else simple.className = "menu-button";
    simple.innerHTML = "<div class='icon-spinner icono'></div>  Gráfico simple";
    simple.setAttribute("id","pie_simple");
    f.appendChild(simple);
    f.appendChild(complex);
    menu.appendChild(f);
    menu.innerHTML += '<ul>\
          <li><a href="https://github.com/juanpablocruz/Graph-app/zipball/master">Download <strong>ZIP File</strong></a></li>\
          <li><a href="https://github.com/juanpablocruz/Graph-app/tarball/master">Download <strong>TAR Ball</strong></a></li>\
          <li><a href="https://github.com/juanpablocruz/Graph-app">View On <strong>GitHub</strong></a></li>\
        </ul>';
    var data_content = document.querySelectorAll("#graph-data")[0];
    var f = document.createDocumentFragment();
    var complex = document.createElement("DIV");
    complex.setAttribute("id","attributes-pannel");
    f.appendChild(complex);
    data_content.appendChild(f);
}

_.prototype.draw = function(data,radio,text){
    var suma = 0;
    var porciones = Array();
    
    _().each(data,function(i){
        suma += data[i]["value"];
    });
    
    
    _().each(data,function(i){
        if(localStorage.data && JSON.parse(localStorage.data)[i]["color"])
            var color = new Color(JSON.parse(localStorage.data)[i]["color"]);
        else{
            if(i>=colores.length){
                var color = colores[(i%colores.length)+2];
            }
            else var color=colores[i];
        }
        var p = ( data[i]["value"] * 100 / suma)*( Math.PI*2/100);
        porciones.push({
            porcentaje : p,
            color: color});
    })
    
    for (var i = 0; i < data.length; i++) {
        this.drawPieSegment(this.ctx, i,porciones,radio);
    }
    if(text){
        for (var i = 0; i < data.length; i++) {
            this.writePieText(this.ctx, i,porciones,radio);
        }
    }
    else{
        for (var i = 0; i < data.length; i++) {
            this.drawPieGroupText(this.ctx, i,porciones,radio+130);
        }
    }
}

_.prototype.drawPie = function(canvas,data){
    this.data = data;
    create_data_set(this.data_content,data);
    this.ctx = canvas.getContext("2d");
    var radio = 0;
    if(pie_mode=="complex"){
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
            fragmentos.push({value: total, label: grupos[i].label});
            total = 0;
        });
        this.draw(fragmentos,180,false);
        radio = 180;
        localStorage.grupos = JSON.stringify(fragmentos);
    }
    else{
        radio = 200;
    }
    this.draw(data,radio-20,true);


}
_.prototype.sumTo = function(a,i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
        sum += a[j]["porcentaje"];    	
    }
    return sum;
}

_.prototype.drawPieSegment = function(context, i,porciones,r){

    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"];
    var endingAngle = startingAngle + arcSize;
    
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

_.prototype.drawPieGroupText = function(context,i,porciones,r){
    var centerx = Math.floor(context.canvas.width/2);
    var centery = Math.floor(context.canvas.height/2);
    radius = r+20;

    var tc;
    if(porciones[i]["color"].lab.l < 65)tc = "#FFF";
    else tc = "#333";
    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"]-0.35;
    var endingAngle = (startingAngle + arcSize/2);

    var dy = Math.sin(endingAngle)/2;
    var dx = 2*Math.cos(endingAngle)/3;
    context.font = '16px "Mic 32 New Rounded"';
    var width = context.measureText( this.grupos[i]["label"]).width;

    context.fillStyle = "#FFF";

    var group = new Kinetic.Group({
        draggable:true,
        dragBoundFunc: function(pos,e) {

        var centerX = centerx - (dx*radius);
        var centerY = Math.floor(context.canvas.height/2);
        if(pos.x < 0){
            if(e && ((e.x) < centerX)){
                text_data.setFill("#333");
                _.layer.draw();
            }
            else{
                text_data.setFill(tc);
                _.layer.draw();
            }
        }
        else if(pos.x > 0){
            if(e && ((e.x) > (centerX+(radius*2)))){
                text_data.setFill("#333");
                _.layer.draw();
            }
            else{
                text_data.setFill(tc);
                _.layer.draw();
            }
        }
            return pos;
        },
        id: "pie_text_"+i}
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
            fontFamily: "Mic 32 New Rounded",
            fill: "#fff",
            padding: 2,
            paddingLeft: -5,
        });

    console.log(this.grupos[i]);
    var text_data = new Kinetic.Text({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius) + 24,
            fontSize: 12,
            fontFamily: "Mic 32 New Rounded",
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
_.prototype.writePieText = function(context,i,porciones,r){
    var centerx = Math.floor(context.canvas.width/2);
    var centery = Math.floor(context.canvas.height/2);
    radius = r+20;

    var tc;
    if(porciones[i]["color"].lab.l < 65)tc = "#FFF";
    else tc = "#333";
    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"]-0.35;
    var endingAngle = (startingAngle + arcSize/2);

    var dy = Math.sin(endingAngle)/2;
    var dx = 2*Math.cos(endingAngle)/3; 
    context.font = '16px "Mic 32 New Rounded"';
    var width = context.measureText( this.data[i]["label"]).width;

    context.fillStyle = "#FFF";	

    var group = new Kinetic.Group({
        draggable:true,
        dragBoundFunc: function(pos,e) {
        
        var centerX = centerx - (dx*radius)-30;
        var centerY = Math.floor(context.canvas.height/2);
        if(pos.x < 0){
            if(e && ((e.x) < centerX)){
                text_data.setFill("#333");
                _.layer.draw();
            }
            else{
                text_data.setFill(tc);
                _.layer.draw();
            }
        }
        else if(pos.x > 0){
            if(e && ((e.x) > (centerX+(radius*2)))){
                text_data.setFill("#333");
                _.layer.draw();
            }
            else{
                text_data.setFill(tc);
                _.layer.draw();
            }
        }
            return pos;
        }, 
        id: "pie_text_"+i}
                                 );
    var width = context.measureText( this.data[i]["label"]).width;
    var t =  this.data[i]["label"];
    var texto = "",w = 0, l1 = 100, l2 = 150,ancho=0,lineas = 1;
    var mayor = 0;
    _().each(t.split(" "), function(k,te){
       w=context.measureText(te[k]).width;
        ancho += w;
        if( ancho > l1){
         if(ancho > l2){
             texto += "\n"+te[k]+" ";
             if(k != te.length-1)
                 ancho=0;
             else{
                ancho =l1;
             }
             //console.log(te[k]+" "+ancho+" "+k+" "+te.length );
             lineas++}
        else {
            texto+=te[k]+" ";
        }
       }
        else{
           texto+=te[k]+" ";
            ancho += w;
        }
    });

    if(lineas>1)width = ancho;
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
            fontFamily: "Mic 32 New Rounded",
            fill: "#fff",
            padding: 2,
            paddingLeft: -5,
        });
    
    var text_data = new Kinetic.Text({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius) + padding+4,
            fontSize: 12,
            fontFamily: "Mic 32 New Rounded",
            text: this.data[i]["value"]+"%",
            fill: tc,
            padding: 1,
        });
    group.add(box);
    group.add(text_label); 
    group.add(text_data);
    _.layer.add(group);
    _.layer.draw();
}
