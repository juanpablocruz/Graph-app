var table_data = "";
var columna = false, fila = false;
_.prototype.display_table = function(workbook){
    var mapa = {"A":1,"B":2,"C":3,"D":4,"E":5,"F":6,"G":7,"H":8,"I":9,
               "J":10,"K":11,"L":12,"M":13,"N":14,"O":15,"P":16,"Q":17,"R":18,
               "S":19,"T":20,"U":21,"V":22,"W":23,"X":23,"Y":24,"Z":25,
                "AA":26,"BB":27,"CC":28,"DD":29,"EE":30,"FF":31,"GG":32,
               "HH":33, "II":34, "JJ":35, "KK":36,"LL":37,"MM":38,"NN":39,"OO":40,
               "PP":41,"QQ":42,"RR":43,"SS":44,"TT":45,"UU":46,"VV":47,"WW":48,"XX":49,
               "YY":50,"ZZ":51};
    var limits;
    for (var prop in workbook) {

        var boundaries = workbook[prop]["!ref"].split(":")[1].split("");

        var num = 0;
        for(var i = 1; i < boundaries.length; i++) {
            num += parseInt(boundaries[i]);
        }

        limits = {n:mapa[boundaries[0]],m:num+1};

        var excel = new Array();
        var weights = new Array();
        for(var n=0;n < limits.n; n++) {
            excel.push(new Array());
            weights.push(new Array());
            for (var m=0; m< limits.m; m++) {
                excel[n].push({data:"",col:0,sheet:0});
                weights[n].push(0);
            }
        }

        for (var col in workbook[prop]) {
            if (typeof workbook[prop][col]["raw"] != "undefined") {
                var div = $("<div col='"+col+"' sheet='"+prop+"'>"+workbook[prop][col]["raw"]+"</div>");
                var pos = col.split("");
                excel[mapa[pos[0]]-1][pos[1]] = {
                    data:workbook[prop][col]["raw"],
                    col:col,
                    sheet: prop
                };
            }
        }
    }

    var tabla = $("<table></table>");
    $("#output").html("");
    for(var i = 0; i < limits.n; i++) {
        for(var j = 0; j < limits.m; j++) {
            if(excel[i][j]["data"]!=0){
                weights[i][j] = 1;
            }
        }
    }
    var col = new Array();
    for (var f=0; f<limits.m; f++) {
        var tmp = 0;
        for (var c = 0; c < limits.n; c++) {
            tmp += weights[c][f];
        }
        col.push(tmp);
    }

    var fil = new Array();
    for (var c=0; c<limits.n; c++) {
        var tmp = 0;
        for (var f = 0; f < limits.m; f++) {
            tmp += weights[c][f];
        }
        fil.push(tmp);
    }

    var table_data = findTable(col,fil);
    var data = [];
    for(var i = 0; i < table_data["cols"].length; i++) {
        var tr = $("<tr></tr>");

        for(var j = 0; j < table_data["rows"].length; j++) {

            var c = table_data["cols"][i];
            var r = table_data["rows"][j];
            var td = $("<td><div class='dato drop'>"+
                       excel[r][c]["data"]+
                       "</div></td>");
            tr.append(td);
        }
        tabla.append(tr);
    }

    $("#output").append(tabla);
            $("#output").append("<div id='abajo'><img src='arriba.jpg'></div><div id='lado'><img src='lado.png'></div>");

            $("#output").append("<div id='borrar-fila'>Borrar fila</div>");
            $("#output").append("<div id='borrar-columna'>Borrar columna</div>");

            $("#borrar-fila").on("click",function() {
                if(!fila)fila = true;
                else fila = false;
                columna = false;
            });
            $("#borrar-columna").on("click",function() {
                if(!columna)columna = true;
                else columna = false;
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
            })
            $("#abajo").on("click",function() {
                var a = new Array();
                for ( var i = 0; i < ($("tr").first().find("td").length)-1; i++) {
                    a.push({});
                }
                $("tr").each(function(i,e) {
                    $(e).find("td:gt(0)").each(function(j,el) {
                        a[j][$(e).find("td").first().text()] = Math.round($(el).text() * 100) / 100;
                    });

                });
                draw(a);
                
            });
            
            $("#lado").on("click",function() {
                var a = new Array();
                for ( var i = 0; i < ($("tr").length)-1; i++) {
                    a.push({});
                }
                $("tr:nth-child(1)").find("td").each(function(i,e) {
                    $("tr:gt(0)").find("td:nth-child("+(i+1)+")").each(function(j,el) { 
                        a[j][$(e).text()] = Math.round($(el).text() * 100) / 100;
                    });
                    
                });

                draw(a);
            }); 
}
function draw(a) {
    tipo = localStorage.chartType;

    var data = new Array();

    changeStep($(".current_step"),"next");

    switch(tipo) {
        case "Tartas":
            for(var i = 0; i < a.length; i++) {
                _().each(Object.keys(a[i]),function(j,t) {
                    data.push({label: t[j], value: Math.round(a[i][t[j]] * 100) / 100});
                });
            }
            localStorage.data = JSON.stringify(data);
            _("#graph").pie({data:data});
            break;
        case "Barras":
            localStorage.data = JSON.stringify(a);
            _("#graph").bars({data:a});
            break;
        case "Históricos":
            console.log(a);
            localStorage.data = JSON.stringify(a);
            localStorage.leyenda = Object.keys(a[0])[0];
            _("#graph").history({data:a});
            break;
    }

}

function findMedian(lista) {
    var total =0;
    var count = 0;
    lista.forEach(function(i) {
       total+= i;
        if(i != 0) count++;
    });
    return Math.floor(total/count);
}

function foundRelativeModa (lista) {
    var frecuencias = {};
    lista.forEach(function(i) {
        if(typeof frecuencias[i] == "undefined" && i != 0) {
            frecuencias[i] = 1;
        }
        else if(i != 0){
            frecuencias[i] = frecuencias[i]+1;
        }
    });
    var max = 0;
    var max_item = 0;
    for (var prop in frecuencias) {
        if(frecuencias[prop] > max) {
            max = frecuencias[prop];
            max_item = prop;
        }
    }
    return max_item;
}
function calculateDistances(lista) {
    var distancias = new Array();
    for(var i=0; i< lista.length-1;i++) {
        distancias.push(lista[i+1]-lista[i]);
    }
    distancias.push(lista[lista.length-1]-lista[lista.length-2]);
    return distancias;
}
function findTable ( cols, rows) {
    var col_m = findMedian(cols);
    var row_m = findMedian(rows);
    var col_rated = new Array;
    var row_rated = new Array;
    var col_def = new Array;
    var row_def = new Array;

    if(col_m == 1) col_m = 2;
    if(row_m == 1) row_m = 2;
    for(var i = 0; i < cols.length; i++) {
        if(cols[i] >= col_m) col_rated.push(i);
    }
    for(var i = 0; i < rows.length; i++) {
        if(rows[i] >= row_m) row_rated.push(i);
    }
    var distancias = {dc: calculateDistances(col_rated),
                      dr:calculateDistances(row_rated)};

    for(var i = 0; i < col_rated.length; i++) {
        if( distancias["dc"][i] == 1) col_def.push(col_rated[i]);
    }
    for(var i = 0; i < row_rated.length; i++) {
        if( distancias["dr"][i] == 1) row_def.push(row_rated[i]);
    }
    return {cols: col_def, rows: row_def};
}
