<!DOCTYPE HTML>
<html lang="pt-br">
<head>
	<meta charset="utf-8">
	<title>Plugin Upload Files Js</title>
	<script type="text/javascript">
	    var str_set  = window.parent.document.getElementById('wmuf_box_set').innerHTML;
	    var set      = eval('('+str_set+')');
	    var base_url = set.base_url;
		function loadjquery(url, insert_scripts) {
		   var head = document.getElementsByTagName('head')[0];
		   var head2  = document.getElementById('box_scripts');
		   var script = document.createElement('script');
		   script.type = 'text/javascript';
		   script.src = url;
		   if (script.readyState){
		        script.onreadystatechange = function(){
		            if (script.readyState == "loaded" || script.readyState == "complete"){
		                script.onreadystatechange = null;
		                insert_scripts();
		            }
		        };
		    } else {
		        script.onload = function(){
		            insert_scripts();
		        };
		    }
		   head2.appendChild(script);
		}
		function loadStyle() {
		   var head = document.getElementsByTagName('head')[0];
		   var link = document.createElement('link');
		   link.setAttribute("type","text/css");
		   link.setAttribute("rel","stylesheet");
		   link.setAttribute("href", base_url+"wmuf/wmufStyles/jquery-wmuf-1.0.css");
		   head.appendChild(link);
		}
		function insert_scripts(){
			$.getScript(base_url+"wmuf/wmufJs/json2.js");
			$.getScript(base_url+"wmuf/wmufJs/plupload/browserplus-min.js");
			$.getScript(base_url+"wmuf/wmufJs/plupload/plupload.js", function(){
				var quant = 6;
				var total = 0;
				$.getScript(base_url+"wmuf/wmufJs/plupload/plupload.gears.js", function(){
					total++;
					custom_config(quant, total);
				});
				$.getScript(base_url+"wmuf/wmufJs/plupload/plupload.silverlight.js", function(){
					total++;
					custom_config(quant, total);
				});
				$.getScript(base_url+"wmuf/wmufJs/plupload/plupload.flash.js", function(){
					total++;
					custom_config(quant, total);
				});
				$.getScript(base_url+"wmuf/wmufJs/plupload/plupload.browserplus.js", function(){
					total++;
					custom_config(quant, total);
				});
				$.getScript(base_url+"wmuf/wmufJs/plupload/plupload.html4.js", function(){
					total++;
					custom_config(quant, total);
				});
				$.getScript(base_url+"wmuf/wmufJs/plupload/plupload.html5.js", function(){
					total++;
					custom_config(quant, total);
				});
			});
		}
		function custom_config(quant, total){
			if(quant == total){
			   var head = document.getElementsByTagName('head')[0];
			   var head2  = document.getElementById('box_scripts');
			   var script = document.createElement('script');
			   script.type = 'text/javascript';
			   script.src = base_url+"wmuf/wmufJs/plupload/custom_config_plupload.js";
			   head2.appendChild(script);
			}
		}
		window.onload = function(){
			loadStyle();
			loadjquery(base_url+"wmuf/wmufJs/jquery-1.10.2.min.js", insert_scripts);
		}
	</script>
</head>

<body id='wmuf_body_1'>
	<div class='main'>
	<h1 class='title_h1' id='title_teste'> Upload de arquivos </h1>
	<div class='wrap' id='container'>
		<div id='wmuf_max_error' ></div>
		<div id='filelist'>Aguarde...</div>
		<div class='actions' id='wmuf_links'>
			<a href="javascript:;" class='wmuf_btn wm_btn_warning' id='wmuf_upload_cancel' title='Cancelar Uploads'>Cancelar Uploads</a>
			<a href="javascript:;" class='wmuf_btn wm_btn_inverse' id='wmuf_select_files' title='Selecionar Arquivos'>Selecionar Arquivos</a>
			<a href="javascript:;" class='wmuf_btn wm_btn_ok' id="wmuf_make_upload" title='Fazer Upload'>Fazer Upload</a>
			<a href="javascript:;" class='wmuf_btn wm_btn_error' id='wmuf_revome_files' title='Remover Arquivos'>Remover Arquivos</a>
			<a href="javascript:;" class='wmuf_btn wm_btn_normal' id="wmuf_add_files" title='Adicionar Arquivos'>Adicionar Arquivos</a>
			<span class="wmuf_btn wmuf_btn_load">Enviando...</span>
		</div>
	</div>
</div>
<div id='box_scripts'></div>
</body>
</html>