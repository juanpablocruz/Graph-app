var Color = function(color,type){
    if(color.match(/#/g)){
        this.hex = color;
        this.rgb = this.hexToRgb(color);
        this.XYZ = this.RGBtoXYZ(this.rgb);
        this.lab = this.XYZtoLAB(this.XYZ);
        this.cmyk = this.rgbToCMYK(this.rgb);
        this.hsv = this.rgbToHSV(this.rgb);
        this.hsl = this.rgbToHsl(this.rgb);
    }
    else{
        switch(type){
        case "rgb":
            this.rgb = this.rgbToRGB(color);
            this.hex = this.rgbToHex(this.rgb);
            this.XYZ = this.RGBtoXYZ(this.rgb);
            this.lab = this.XYZtoLAB(this.XYZ);
            this.cmyk = this.rgbToCMYK(this.rgb);
            this.hsv = this.rgbToHSV(this.rgb);
            this.hsl = this.rgbToHsl(this.rgb);
            break;
        case "cmyk":
            this.cmyk = this.cmykToCMYK(color);
            this.rgb = this.cmykToRGB(this.cmyk);
            this.hex = this.rgbToHex(this.rgb);
            this.XYZ = this.RGBtoXYZ(this.rgb);
            this.lab = this.XYZtoLAB(this.XYZ);
            this.hsv = this.rgbToHSV(this.rgb);
            this.hsl = this.rgbToHsl(this.rgb);
            break;
        case "lab":
            this.lab = this.labToLAB(color);
            this.XYZ = this.labToXYZ(this.lab);
            this.rgb = this.xyzToRGB(this.XYZ);
            this.hex = this.rgbToHex(this.rgb);
            this.cmyk = this.rgbToCMYK(this.rgb);
            this.hsv = this.rgbToHSV(this.rgb);
            this.hsl = this.rgbToHsl(this.rgb);
            break;
        case "hsv":
            this.hsv = this.hsvToHSV(color);
            this.rgb = this.hsvToRGB(this.hsv);
            this.hex = this.rgbToHex(this.rgb);
            this.XYZ = this.RGBtoXYZ(this.rgb);
            this.lab = this.XYZtoLAB(this.XYZ);
            this.cmyk = this.rgbToCMYK(this.rgb);
            this.hsl = this.rgbToHsl(this.rgb);
            break;
        case "hsl":
            this.hsl = this.hslToHSL(color);
            this.rgb = this.hslToRGB(this.hsl);
            this.hsv = this.rgbToHSV(this.rgb);
            this.hex = this.rgbToHex(this.rgb);
            this.XYZ = this.RGBtoXYZ(this.rgb);
            this.lab = this.XYZtoLAB(this.XYZ);
            this.cmyk = this.rgbToCMYK(this.rgb);
            break;
        }
    }
}
Color.prototype.rgbToRGB = function(str){
    var c = str.replace("(","");
    c = c.replace(")","");
    var digits = c.split(",");
    
    var red = parseInt(digits[0]);
    var green = parseInt(digits[1]);
    var blue = parseInt(digits[2]);
    return {r: red, g: green, b: blue};
}
Color.prototype.cmykToCMYK = function(str){
    var c = str.replace("(","");
    c = c.replace(")","");
    var digits = c.split(",");
    
    var c = parseFloat(digits[0]);
    var m = parseFloat(digits[1]);
    var y = parseFloat(digits[2]);
    var k = parseFloat(digits[3]);
    return {c: c, m: m, y: y, k: k};
}
Color.prototype.hsvToHSV = function(str){
    var c = str.replace("(","");
    c = c.replace(")","");
    var digits = c.split(",");
    
    var h = parseFloat(digits[0]);
    var s = parseFloat(digits[1]);
    var v = parseFloat(digits[2]);
    return {h: h, s: s, v: v};
}
Color.prototype.hslToHSL = function(str){
    var c = str.replace("(","");
    c = c.replace(")","");
    var digits = c.split(",");

    var h = parseFloat(digits[0]);
    var s = parseFloat(digits[1]);
    var l = parseFloat(digits[2]);
    if( h<0 ) h=365+h;
    if( s<0 ) s=0;
    if( l<0 ) l=0;
    if( h>=360 ) h=359;
    if( s>100 ) s=100;
    if( l>100 ) l=100;
	s/=100;
	l/=100;
    return {h: h, s: s, l: l};
}
Color.prototype.labToLAB = function(str){
    var c = str.replace("(","");
    c = c.replace(")","");
    var digits = c.split(",");
    
    var l = parseInt(digits[0]);
    var a = parseInt(digits[1]);
    var b = parseInt(digits[2]);
    return {l: l, a: a, b: b};
}
Color.prototype.rgbToHex = function(color) {
    var hex = color.r*65536+color.g*256+color.b;
				hex = hex.toString(16,6);
				len = hex.length;
				if( len<6 )
					for(i=0; i<6-len; i++)
						hex = '0'+hex;
    return  '#' + hex;
}
Color.prototype.hexToRgb = function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
Color.prototype.RGBtoXYZ = function(RGB){
        var_R = parseFloat( RGB.r / 255 )        //R from 0 to 255
        var_G = parseFloat( RGB.g / 255 )        //G from 0 to 255
        var_B = parseFloat( RGB.b / 255 )        //B from 0 to 255
    
        if ( var_R > 0.04045 ) var_R = Math.pow(( ( var_R + 0.055 ) / 1.055 ), 2.4)
        else                   var_R = var_R / 12.92
        if ( var_G > 0.04045 ) var_G = Math.pow(( ( var_G + 0.055 ) / 1.055 ) , 2.4)
        else                   var_G = var_G / 12.92
        if ( var_B > 0.04045 ) var_B = Math.pow(( ( var_B + 0.055 ) / 1.055 ) , 2.4)
        else                   var_B = var_B / 12.92
    
        var_R = var_R * 100
        var_G = var_G * 100
        var_B = var_B * 100
    
        //Observer. = 2°, Illuminant = D65
        X = Math.round(var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805);
        Y = Math.round(var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722);
        Z = Math.round(var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505);
        
        return {x:X, y:Y, z:Z};
    }
Color.prototype.XYZtoLAB = function(XYZ)
    {
        var ref_X =  95.047;
        var ref_Y = 100.000;
        var ref_Z = 108.883;
    
        var_X = XYZ.x / ref_X          //ref_X =  95.047   Observer= 2°, Illuminant= D65
        var_Y = XYZ.y / ref_Y          //ref_Y = 100.000
        var_Z = XYZ.z / ref_Z          //ref_Z = 108.883
    
        if ( var_X > 0.008856 ) var_X =  Math.pow(var_X,( 1/3 ))
        else                    var_X = ( 7.787 * var_X ) + ( 16 / 116 )
        if ( var_Y > 0.008856 ) var_Y = Math.pow(var_Y,( 1/3 ))
        else                    var_Y = ( 7.787 * var_Y ) + ( 16 / 116 )
        if ( var_Z > 0.008856 ) var_Z = Math.pow(var_Z , ( 1/3 ))
        else                    var_Z = ( 7.787 * var_Z ) + ( 16 / 116 )
    
        CIE_L = Math.round(( 116 * var_Y ) - 16);
        CIE_a = Math.round(500 * ( var_X - var_Y ))
        CIE_b = Math.round(200 * ( var_Y - var_Z ))
    
    return {l:CIE_L,a: CIE_a, b: CIE_b};
    }
Color.prototype.rgbToCMYK = function(RGB){
     var computedC = 0;
     var computedM = 0;
     var computedY = 0;
     var computedK = 0;
    
     //remove spaces from input RGB values, convert to int
     var r = RGB.r;
     var g = RGB.g; 
     var b = RGB.b; 
    
     if ( r==null || g==null || b==null ||
         isNaN(r) || isNaN(g)|| isNaN(b) )
     {
       return;
     }
     if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
       return;
     }
    
     // BLACK
     if (r==0 && g==0 && b==0) {
      computedK = 1;
      return [0,0,0,1];
     }
    
     computedC = 1 - (r/255);
     computedM = 1 - (g/255);
     computedY = 1 - (b/255);
    
     var minCMY = Math.min(computedC,
                  Math.min(computedM,computedY));
     computedC = (computedC - minCMY) / (1 - minCMY) ;
     computedM = (computedM - minCMY) / (1 - minCMY) ;
     computedY = (computedY - minCMY) / (1 - minCMY) ;
     computedK = minCMY;
    
     return {c:computedC,m:computedM,y:computedY,k:computedK};
}
Color.prototype.cmykToRGB = function(cmyk){
    var C = (cmyk.c * ( 1 - cmyk.k) + cmyk.k);
    var M = (cmyk.m * ( 1 - cmyk.k) + cmyk.k);
    var Y = (cmyk.y * ( 1 - cmyk.k) + cmyk.k);
    var R = Math.round(( 1 - C ) * 255);
    var G = Math.round(( 1 - M ) * 255);
    var B = Math.round(( 1 - Y ) * 255);
    return {r: R, g: G, b: B};
    
}
Color.prototype.rgbToHSV = function(RGB){
    var r = RGB.r;
    var g = RGB.g;
    var b = RGB.b;
    var computedH = 0;
    var computedS = 0;
    var computedV = 0;

    if ( r==null || g==null || b==null ||
        isNaN(r) || isNaN(g)|| isNaN(b) ) {
        return;
    }
    r=r/255; g=g/255; b=b/255;
    var minRGB = Math.min(r,Math.min(g,b));
    var maxRGB = Math.max(r,Math.max(g,b));
    
    // Black-gray-white
    if (minRGB==maxRGB) {
        computedV = minRGB;
        return {h:0,s:0,v:computedV};
    }
    
    // Colors other than black-gray-white:
    var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
    var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
    computedH = 60*(h - d/(maxRGB - minRGB));
    computedS = (maxRGB - minRGB)/maxRGB;
    computedV = maxRGB;
    return {h:computedH,s:computedS,v:computedV};
}

Color.prototype.hsvToRGB = function(HSV){
    var H=HSV.h;
    var S = HSV.s;
    var V = HSV.v;
    
    if ( S == 0 )                       //HSV from 0 to 1
    {
       R = V * 255
       G = V * 255
       B = V * 255
    }
    else 
    {
       var_h = H * 6
       if ( var_h == 6 ) var_h = 0      //H must be < 1
       var_i = parseInt( var_h )             //Or ... var_i = floor( var_h )
       var_1 = V * ( 1 - S )
       var_2 = V * ( 1 - S * ( var_h - var_i ) )
       var_3 = V * ( 1 - S * ( 1 - ( var_h - var_i ) ) )
    
       if      ( var_i == 0 ) { var_r = V     ; var_g = var_3 ; var_b = var_1 }
       else if ( var_i == 1 ) { var_r = var_2 ; var_g = V     ; var_b = var_1 }
       else if ( var_i == 2 ) { var_r = var_1 ; var_g = V     ; var_b = var_3 }
       else if ( var_i == 3 ) { var_r = var_1 ; var_g = var_2 ; var_b = V     }
       else if ( var_i == 4 ) { var_r = var_3 ; var_g = var_1 ; var_b = V     }
       else                   { var_r = V     ; var_g = var_1 ; var_b = var_2 }
    
       R = Math.round(var_r * 255)                 //RGB results from 0 to 255
       G = Math.round(var_g * 255)
       B = Math.round(var_b * 255)
    }

    return {r:R,g:G,b:B};
}

Color.prototype.xyzToRGB= function(XYZ){
    var X = XYZ.x;
    var Y = XYZ.y;
    var Z = XYZ.z;
    
    var_X = X / 100        //X from 0 to  95.047      (Observer = 2°, Illuminant = D65)
    var_Y = Y / 100        //Y from 0 to 100.000
    var_Z = Z / 100        //Z from 0 to 108.883
    
    var_R = var_X *  3.2406 + var_Y * -1.5372 + var_Z * -0.4986
    var_G = var_X * -0.9689 + var_Y *  1.8758 + var_Z *  0.0415
    var_B = var_X *  0.0557 + var_Y * -0.2040 + var_Z *  1.0570
    
    if ( var_R > 0.0031308 ) var_R = 1.055 * ( Math.pow(var_R , ( 1 / 2.4 )) ) - 0.055
    else                     var_R = 12.92 * var_R
    if ( var_G > 0.0031308 ) var_G = 1.055 * ( Math.pow(var_G , ( 1 / 2.4 )) ) - 0.055
    else                     var_G = 12.92 * var_G
    if ( var_B > 0.0031308 ) var_B = 1.055 * ( Math.pow(var_B , ( 1 / 2.4 )) ) - 0.055
    else                     var_B = 12.92 * var_B
    
    R = Math.round(var_R * 255)
    G = Math.round(var_G * 255)
    B = Math.round(var_B * 255)
    return {r:R,g:G,b:B};
}

Color.prototype.labToXYZ = function(lab){
    var_Y = ( lab.l + 16 ) / 116
    var_X = lab.a / 500 + var_Y
    var_Z = var_Y - lab.b / 200
    
    var ref_X =  95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;
    
    if ( Math.pow(var_Y,3) > 0.008856 ) var_Y = Math.pow(var_Y,3)
    else                      var_Y = ( var_Y - 16 / 116 ) / 7.787
    if ( Math.pow(var_X,3) > 0.008856 ) var_X = Math.pow(var_X,3)
    else                      var_X = ( var_X - 16 / 116 ) / 7.787
    if ( Math.pow(var_Z,3) > 0.008856 ) var_Z = Math.pow(var_Z,3)
    else                      var_Z = ( var_Z - 16 / 116 ) / 7.787
    
    X = Math.round(ref_X * var_X)     //ref_X =  95.047     Observer= 2°, Illuminant= D65
    Y = Math.round(ref_Y * var_Y)     //ref_Y = 100.000
    Z = Math.round(ref_Z * var_Z)     //ref_Z = 108.883
    return {x: X,y: Y, z:Z};
}
Color.prototype.rgbToHsl = function(rgb) {
    var r = rgb.r;
    var g = rgb.g;
    var b = rgb.b;
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h:h, s:s, l:l };
}
function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
Color.prototype.hslToRGB = function(hsl) {
    var r, g, b;
    var s = hsl.s, h=hsl.h,l=hsl.l;
    C = (1-Math.abs(2*l-1))*s;
    hh = h/60;
    X = C*(1-Math.abs(hh%2-1));
    r = g = b = 0;
    if( hh>=0 && hh<1 )
    {
        r = C;
        g = X;
    }
    else if( hh>=1 && hh<2 )
    {
        r = X;
        g = C;
    }
    else if( hh>=2 && hh<3 )
    {
        g = C;
        b = X;
    }
    else if( hh>=3 && hh<4 )
    {
        g = X;
        b = C;
    }
    else if( hh>=4 && hh<5 )
    {
        r = X;
        b = C;
    }
    else
    {
        r = C;
        b = X;
    }
    m = l-C/2;
    r += m;
    g += m;
    b += m;
    r *= 255;
    g *= 255;
    b *= 255;
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);

  return {r:r, g:g, b:b};
}
