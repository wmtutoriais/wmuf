/*
 * desenvolvidor por Welison Menezes
 * welisonmenezes@gmail.com
 */
(function( $ ){
    $.fn.wmuf = function(options) {
        var element  = $(this);
        var defaults = {
            'base_url'         : false, // *
            'delete_script'    : 'delete.php',
            'directory'        :'uploads/',
            'file_extensions'  : 'jpg,gif,png',
            'input_container'  : false, // *
            'max_file_size': '10mb',
            'resize': false,
            'thumb': false,
            'thumb_w': 80,
            'total_files'  : 10,
            'upload_script':'upload.php',
            'zip_extensions' : 'zip,rar'
        };
        var settings = $.extend(true, defaults, options);
        if( settings.base_url === false ){
            alert('O parâmetro base_url no plugin wmuf é obrigatório!');
        }else if( settings.input_container === false ){
            alert('O parâmetro input_container no plugin wmuf é obrigatório!');
        }else{
            funcs.get_json(element, settings);
        } 
    };
    var funcs = {
        get_json: function(el, set){
            var el = el;
            var set = set;
            $.getScript(set.base_url+"wmuf/wmufJs/json2.js", function(){
                funcs.init_lb(el, set);
            });
        },
        init_lb : function(el, set){
            funcs.open_lb(el,set);
            funcs.close_lb();
        },
        open_lb : function(el, set){
            el.click(function(){
                funcs.create_lb(el, set);
                $('html, body').css({'overflow':'hidden'});
                return false;
            });
        },
        create_lb : function(el, set){
            var wmuf_lb       = $('<div id="wmuf_lb" ></div>');
            var wmuf_lb_box   = $('<div id="wmuf_lb_box" ></div>');
            var wmuf_close_lb = $('<span id="wmuf_close_lb" ></span>');
            var wmuf_iframe_1 = $('<iframe src="'+set.base_url+'wmuf/wmufTools/index.php" name="wmuf_iframe_1" id="wmuf_iframe_1" marginwidth="0" marginheight="0" align="top" scrolling="auto" frameborder="0" hspace="0" vspace="0" rel="ttt" />');
            $('body div#wmuf_lb, body div#wmuf_lb_box').remove();
            $('body').prepend(wmuf_lb);
            $('body #wmuf_lb').after(wmuf_lb_box);
            $('body #wmuf_lb_box').prepend(wmuf_iframe_1);
            $('body #wmuf_lb_box').prepend(wmuf_close_lb);
            var wmuf_box_set  = $('<div id="wmuf_box_set">'+JSON.stringify(set)+'</div>');
            $('#wmuf_lb_box').prepend(wmuf_box_set);
            funcs.center_el( $('#wmuf_lb_box') );
            funcs.init_in_lb(wmuf_iframe_1, set);
        },
        close_lb : function(){
            $('body').delegate('#wmuf_lb, #wmuf_close_lb', 'click', function(){
                $('body #wmuf_lb_box').fadeOut('fast', function(){
                    $(this).remove();
                    $('body #wmuf_lb').fadeOut('fast', function(){
                        $(this).remove();
                        $('html, body').css({'overflow':'auto'});
                    });
                });
                return false;
            });
        },
        center_el : function(el){
            var w_h = $(window).height();
            var w_w = $(window).width();
            var e_h = el.outerHeight();
            var e_w = el.outerWidth();
            var h   = Math.max(0, ( ( w_h - e_h ) / 2) ) + "px";
            var w   = Math.max(0, ( ( w_w - e_w ) / 2) ) + "px";
            el.css({ 'top' :h,'left':w });
        },
        init_in_lb : function(ifr, set){
            ifr.load(function(){
                funcs.styles_ifr();
            });
        },
        styles_ifr : function(){
            $('#wmuf_iframe_1').contents().find('#wmuf_body_1 .main').css({
                'min-height' : $('#wmuf_iframe_1').height()+'px'
            });
        }
    }
})( jQuery );