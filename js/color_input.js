function clinpt(id) {
        if (window === this) {
            return new clinpt(id);
        }
        switch (typeof id) {
            case "string":
                this.id = id;
                this.e = document.querySelectorAll(id);
                break;
            case "object":
                this.e = id;
                break;
        }
        return this;
    }

clinpt.prototype = {
    get: function(selector) {
          return this;
    },
    input: function(val) {
            "use strict";
            var default_color = (typeof val != "undefined")? val : "black";

            $(this.e).append(this.create_html(val));

        },
    create_html: function(val) {
        var html = $('<div id="palette">\
    <button id="color_selector" class="color_data" value='+val+' style="background:'+val+'"></button>\
    <div id="color_palette">\
        <div class="color_data" value="#d21f17" style="background:#d21f17;"></div>\
        <div class="color_data" value="#d3cec6" style="background:#d3cec6;"></div>\
        <div class="color_data" value="#ad9172" style="background:#ad9172;"></div>\
        <div class="color_data" value="#4293af" style="background:#4293af;"></div>\
        <div class="color_data" value="#cea072" style="background:#cea072;"></div>\
        <div class="color_data" value="#82afc1" style="background:#82afc1;"></div>\
    </div>\
    </div>  ');
        return html;
    },
    loadFunctions: function() {

        $("#color_selector").on("click", function () {
            $("#color_palette").toggleClass("color_active_palette");
        });
        $("#color_palette .color_data").on("click",function() {
            $("#color_selector").attr("value",$(this).attr("value"));
            $("#color_selector").css("background",$(this).attr("value"));
            $("#color_palette").toggleClass("color_active_palette");
        });
    }
}
