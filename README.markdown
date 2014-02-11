#Graph App#

Aplicación de creación de gráficos de Cores.
##Librerias##

###Color.js###

Librería de manejo de colores.

Traduce cualquier color en RGB, HSL, HSV, HTML, CMYK, LAB a todos los demás.

```JavaScript
var color_html = new Color("#d21f17");

color_html = {
    XYZ: {
        x: 27
        y: 15
        z: 2
    },
    cmyk: {
        c: 0
        k: 0.176470588
        m: 0.852380952
        y: 0.890476190
    },
    hex: "#d21f17",
    hsl: {
        h: 0.007130124
        s: 0.802575107
        l: 0.456862745
    },
    hsv: {
        h: 2.566844919
        s: 0.890476190
        v: 0.823529411
    },
    lab: {
        l: 46
        b: 53
        a: 63
    },
    rgb: {
        r: 210
        g: 31
        b: 23
    }
}
```

###color_input.js###
Input de color sustituto a input type=color, con paleta personalizada.

```JavaScript
clinpt(contenedor).input(color);
clinpt().loadFunctions();
```
###Excel.js###

Librería para leer archivos xlsx, los carga y los lee buscando la tabla con el contenido relevante.
Guarda los datos en un array y los muestra en una tabla.


###core.js###
Librería principal.
Genera el canvas, aporta las funciones principales y carga los modulos.

* pie.js
* barras.js
* historic.js

##Datos##
GraphApp acepta todo tipo de xlsx.
El único requisito, es que el archivo tenga una única hoja de trabajo y tenga una tabla claramente diferenciada y no demasiado grande.

El formato de datos que se esperan para cada tipo de gráfico son:

###Tartas###
Para una configuración horizontal:
| Etiqueta | Valor |
|----------|-------|
| Etiqueta | Valor |
| Etiqueta | Valor |

Por ejemplo:

| Otros productos  | 14.77  |
| Fuelóleos  | 16.94  |
| Gasóleos  | 48.62  |
| Querosenos  | 8.8  |
| Gasolinas  | 8.21  |
| GLP´s  | 2.67  |

Se esperan un conjunto de pares etiqueta valor, por lo que habrá que eliminar cualquier campo extra de información, así como valores negativos.


