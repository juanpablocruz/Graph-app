var tartas = 1;

function create_data_set(dest,d){
    dest.innerHTML = "";
    var f = document.createDocumentFragment();
    var contenedor = document.createElement("DIV");
    contenedor.setAttribute("id","data-list");

    var f = document.createDocumentFragment();
    
    var create = document.createElement("BUTTON");
    create.setAttribute("id","create-group");
    create.innerHTML = "Añadir Grupo";
    var grupos = document.createElement("DIV");
    grupos.setAttribute("id","attr-grupos");
    var ul = document.createElement("UL");
    
    var li = document.createElement("LI");
    li.innerHTML = "<span contenteditable='true'>Grupo1</span>";
    var ul2 = document.createElement("UL");
    
    _().each(d,function(i){
        
        if(i>=colores.length){
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
    });
    li.appendChild(ul2);
    ul.appendChild(li);
    grupos.appendChild(create);
    grupos.appendChild(ul);
    var inpt_sub = document.createElement("BUTTON");
        inpt_sub.type = "submit";
        inpt_sub.innerHTML = "Dibujar";
        inpt_sub.className = "draw_button";
        inpt_sub.addEventListener('click',function(){
            var data = [];
           _().each(document.querySelectorAll("#attr-grupos ul>li div"),function(i,a){
               values = [];
              _().each(a[i].childNodes,function(j,c){
                values.push(c[j].value);
              });
              
              data[i] = {
                    label:values[0],
                    value: parseFloat(values[1]),
                };
               if(i>=colores.length){
                    colores[(i%colores.length)+2] = new Color(values[2]);
                }
                else{
                    colores[i] = new Color(values[2]);
                }
               
           });
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
    complex.className = "menu-button";
    complex.innerHTML = "Gráfico compuesto";
    var simple = document.createElement("DIV");
    simple.className = "menu-button";
    simple.innerHTML = "Gráfico simple";
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

_.prototype.drawPie = function(canvas,data){
    this.data = data;
    create_data_set(this.data_content,data);
    
    this.ctx = canvas.getContext("2d");

    var suma = 0;
    var porciones = Array();
    
    _().each(data,function(i){
        suma += data[i]["value"];
    });
    
    
    _().each(data,function(i){
        if(i>=colores.length){
            var color = colores[(i%colores.length)+2].hex;
        }
        else var color=colores[i].hex; 
        var p = ( data[i]["value"] * 100 / suma)*( Math.PI*2/100);
        porciones.push({
            porcentaje : p,
            color: color});
    })
    
    for (var i = 0; i < data.length; i++) {
        this.drawPieSegment(this.ctx, i,porciones);
    }
    
    for (var i = 0; i < data.length; i++) {
        this.writePieText(this.ctx, i,porciones);
    }
}
_.prototype.sumTo = function(a,i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
        sum += a[j]["porcentaje"];    	
    }
    return sum;
}

_.prototype.drawPieSegment = function(context, i,porciones){
    context.save();
    
    if(i>=colores.length){
        var color = colores[(i%colores.length)+2].hex;
    }
    else var color=colores[i].hex;                    
    
    var startingAngle = (this.sumTo(porciones,i));
    var arcSize = porciones[i]["porcentaje"];
    var endingAngle = startingAngle + arcSize;
    
    var arc = new Kinetic.Shape({
        drawFunc: function(context){
            var centerX = Math.floor(context.canvas.width/2);
            var centerY = Math.floor(context.canvas.height/2);
            radius = 180;
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.arc(centerX, centerY, radius, 
                        startingAngle, endingAngle, false);
            context.closePath();
            context.fillStrokeShape(this);
        },
        fill: color,
        stroke: "#FFF",
        strokeWidth: 1,
    });
    _.layer.add(arc);
    _.layer.draw();

    context.restore();
}
_.prototype.writePieText = function(context,i,porciones){
    var centerx = Math.floor(context.canvas.width/2);
    var centery = Math.floor(context.canvas.height/2);
    radius = 200;
    
    if(i>=colores.length){
        var color = colores[(i%colores.length)+2];
    }
    else var color=colores[i]; 
    
    var tc;
    if(color.lab.l < 65)tc = "#FFF";
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
            if((e.x) < centerX){
                text_data.setFill("#333");
                _.layer.draw();
            }
            else{
                text_data.setFill(tc);
                _.layer.draw();
            }
        }
        else if(pos.x > 0){
            if((e.x) > (centerX+(radius*2))){
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
            text: this.data[i]["label"],
            fontSize: 16,
            fontFamily: "Mic 32 New Rounded",
            fill: "#fff",
            padding: 2,
            paddingLeft: -5,
        });

    
    var text_data = new Kinetic.Text({
            x: centerx + (dx*radius),
            y: centery+ (dy*radius) + 24,
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