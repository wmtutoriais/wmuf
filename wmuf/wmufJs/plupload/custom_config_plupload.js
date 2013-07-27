var str_set = $('#wmuf_box_set', window.parent.document).html();
var set     = JSON.parse( str_set );

// CONFIGUARACOES
if( set.resize != undefined && set.resize != false ){
	var uploader = new plupload.Uploader({
		runtimes : 'gears,html5,flash,silverlight,browserplus',
		browse_button : 'wmuf_select_files',
		container: 'wmuf_links',
		max_file_size : set.max_file_size,
		url : set.upload_script,
		resize : {width : set.resize.w, quality : 90},
		flash_swf_url : set.base_url+'wmuf/wmufJs/plupload/plupload.flash.swf',
		silverlight_xap_url : set.base_url+'wmuf/wmufJs/plupload/plupload.silverlight.xap',
		filters : [
			{title : "Image files", extensions : set.file_extensions},
			{title : "Zip files", extensions : set.zip_extensions}
		]
	});
}else{
	var uploader = new plupload.Uploader({
		runtimes : 'gears,html5,flash,silverlight,browserplus',
		browse_button : 'wmuf_select_files',
		container: 'wmuf_links',
		max_file_size : set.max_file_size,
		url : set.upload_script,
		flash_swf_url : set.base_url+'wmuf/wmufJs/plupload/plupload.flash.swf',
		silverlight_xap_url : set.base_url+'wmuf/wmufJs/plupload/plupload.silverlight.xap',
		filters : [
			{title : "Image files", extensions : set.file_extensions},
			{title : "Zip files", extensions : set.zip_extensions}
		]
	});
}

// INICIALIZANDO
uploader.bind('Init', function(up, params) {
	$('#filelist').html("<div class='wmuf_no_files' >Nenhum arquivo</div>");
	$('#wmuf_body_1').css({'overflow':'auto'});
	$('#wmuf_body_1 .main #container .actions').css({'right':'0px'});
});
uploader.init();

// EXECUTA EM CADA ARQUIVO ADICIONADO
uploader.bind('FilesAdded', function(up, files) {
	$('.wmuf_no_files').remove();
	$('#wmuf_max_error').css({'display':'none'});
	var html = $('#filelist').html();

	// logica de limite de upload
	var cont  = 0;
	var check = 0;
	var hide_in = $('.wmuf_hidden_input', parent.document).attr('rel');
	if( hide_in !== undefined ){
		var quant = hide_in;
	}else{
		var quant = 0;
	}
	var imgs  = $('.wmuf_status').length;
	var limit = set.total_files - imgs - quant;

	for (var i in files) { 
		if( cont < limit ){
			var str_file = JSON.stringify(files[i]);
			if( files[i].size > up.settings.max_file_size ){
				html += '<div id="' + files[i].id + '" class="wmuf_status wmuf_in_wait wmuf_box_error">';
			}else{
				html += '<div id="' + files[i].id + '" class="wmuf_status wmuf_in_wait wmuf_box_ok">';
			}
			html += '<span class="wmuf_filename">'+files[i].name+'</span>';
			html += ' <span class="wmuf_fileformat">- ('+plupload.formatSize(files[i].size)+')</span>';
			html += ' <span class="wmuf_error">Arquivo muito grande!</span>';
			html += '<span class="wmuf_percent"></span>';
			html += '<a title="Remover da fila" class="wmuf_single_cancel"><span class="wmuf_hide">'+str_file+'</span></a>';
			html += '<a title="Excluir arquivo" class="wmuf_single_remove"><span class="wmuf_hide">'+str_file+'</span></a>';
			html += '<span class="wmuf_fileinfo"></span>';
			html += '</div>';
		}else{
			uploader.removeFile(files[i]);
			check++;
		}
		cont++;
	}
	$('#filelist').html(html);
	if( $('.wmuf_in_wait').length > 0 ){
		$('#wmuf_make_upload').css({'display': 'block'});
		$('#wmuf_upload_cancel').css({'display':'block'});
	} else if( $('.wmuf_sent').length > 0 ){
		$('#wmuf_revome_files').css({'display': 'block'});
		$('#wmuf_add_files').css({'display':'block'});
	}
	else{
		$('#wmuf_links').html('<span class="wmuf_error_max">Desculpe você atingiu o limite de Uploads!</span>');
	}

	if( check > 0 ){
		$('#wmuf_max_error').css({'display':'block'}).html('Você só pode enviar '+set.total_files+' arquivos.');
	}
});

// EXECUTA NO LOAD DOS ARQUIVOS
uploader.bind('UploadProgress', function(up, file) {
	$('#filelist').find('.wmuf_percent').html(file.percent+"%");
});

// EXECUTRA APOS O LOAD DE UM ARQUIVO
uploader.bind('FileUploaded', function(up, file, info) {
	$('#'+file.id).removeClass('wmuf_in_wait').addClass('wmuf_sent');
	$('#'+file.id).find('.wmuf_single_cancel').css({'display':'none'});
	$('#'+file.id).find('.wmuf_single_remove').css({'display':'block'});
	$('#'+file.id).find('.wmuf_fileinfo').text(info.response);
});

// EXECUTA APOS O LOAD DE TODOS OS ARQUIVOS
uploader.bind('UploadComplete', function(up, files) {
	uploader.splice();
	$('#wmuf_make_upload').css({'display': 'none'});
	$('#wmuf_upload_cancel').css({'display':'none'});
	$('#wmuf_revome_files').css({'display': 'block'});
	$('#wmuf_add_files').css({'display':'block'});
	$('.wmuf_btn_load').css({'display':'none'});
});

// CLICK PARA COMECAR UPLOAD
$('#wmuf_make_upload').click(function(){ 
	$('#wmuf_max_error').css({'display':'none'});
	$(this).css({'display':'none'});
	$('.wmuf_btn_load').css({'display':'block'});
	uploader.start();
	return false;
});

// CLICK PARA CANCELAR TODOS OS UPLOADS
$('#wmuf_upload_cancel').click(function(){
	$('#wmuf_upload_cancel').css({'display':'none'});
	$('#wmuf_max_error').css({'display':'none'});
	uploader.splice();
	$('.wmuf_in_wait').remove();
	if( $('#filelist').find('div').length < 1 ){
		$('#filelist').html('<div class="wmuf_no_files" >Nenhum arquivo</div>');
	}
	$('#wmuf_make_upload').css({'display': 'none'});
	$('#wmuf_upload_cancel').css({'display':'none'});
	return false;
});

// CLICK PARA CANCELAR UM UPLOAD ESPECIFICO
$('#wmuf_body_1').delegate('.wmuf_single_cancel', 'click', function(){
	var pai  = $(this).parent();
	var file = $(this).find('span').text();
	file     = jQuery.parseJSON(file);
	pai.remove();
	uploader.removeFile(file);
	var box   = $('.wmuf_status');
	var box2  = $('.wmuf_in_wait');
	if( box2.length < 1 ){
		if( box.length < 1 ){
			$('#filelist').html('<div class="wmuf_no_files" >Nenhum arquivo</div>');
		}
		$('#wmuf_make_upload').css({'display': 'none'});
		$('#wmuf_upload_cancel').css({'display':'none'});
	}
	if( box2.length <= set.total_files ){
		$('#wmuf_max_error').css({'display':'none'});
	}
	return false;
});

// CLICK PARA REMOVER TODOS OS ARQUIVOS
$('#wmuf_revome_files').click(function(){
	// remove arquivo via ajax do back
	var sent = $('.wmuf_sent');
	for(var i=0; i<sent.length; i++){
		var element = sent.eq(i).find(".wmuf_fileinfo").text();
		var obj_file = JSON.parse(element);
		for (var x in obj_file){
			ajax_delete( set.delete_script, obj_file[x] );
		}
	}

	// remove do front
	$('.wmuf_sent').remove();

	// administra botoes
	if( $('#filelist').find('div').length < 1 ){
		$('#filelist').html('<div class="wmuf_no_files" >Nenhum arquivo</div>');
		$('#wmuf_make_upload').css({'display': 'none'});
		$('#wmuf_upload_cancel').css({'display':'none'});
	}
	$('#wmuf_revome_files').css({'display': 'none'});
	$('#wmuf_add_files').css({'display':'none'});
	return false;
});

// CLICK PARA REMOVER UM ARQUIVO ESPECIFICO
$('#wmuf_body_1').delegate('.wmuf_single_remove', 'click', function(){
	var pai  = $(this).parent();

	// remove arquivo via ajax do back 
	var element = pai.find(".wmuf_fileinfo").text();
	var obj_file = JSON.parse(element);
	for (var x in obj_file){
		ajax_delete( set.delete_script, obj_file[x] );
	}

	// remove do front
	pai.remove();

	// administra botoes
	var box  = $('.wmuf_status');
	var box2 = $('.wmuf_sent');
	if( box2.length < 1 ){
		if( box.length < 1 ){
			$('#filelist').html('<div class="wmuf_no_files" >Nenhum arquivo</div>');
			$('#wmuf_make_upload').css({'display': 'none'});
			$('#wmuf_upload_cancel').css({'display':'none'});
		}
		$('#wmuf_revome_files').css({'display': 'none'});
		$('#wmuf_add_files').css({'display':'none'});
	}
});

// CLICK ADD FILE IN FORMULARIO
$('#wmuf_add_files').click(function(){
	var file = $('.wmuf_box_ok .wmuf_fileinfo');
	var size = file.length;
	var in_sent = $('.wmuf_hidden_input', parent.document);
	var in_sent_val   = '';
	var in_sent_quant = 0;
	if( in_sent.val() !== undefined ){
		in_sent_val   = in_sent.val()+',';
		in_sent_quant = in_sent.attr('rel');
	}

	// gerando o input de retorno
	var fields  = '';
	for( var i = 0; i < size; i++ ){
		var txt      = file.eq(i).text();
		var obj_file = JSON.parse(txt);
		var f_s      = get_size_object(obj_file);
		for (var x in obj_file){
			fields += x+':'+obj_file[x]+',';
		}
	}
	var input = '<input type="hidden" name="wmuf_file" value="';
	input     += in_sent_val + fields.substring(0,fields.length - 1);
	input     += '" class="wmuf_hidden_input" rel="'+( i + parseInt(in_sent_quant) )+'" />';
	var retorno = input;
	if( set.thumb != undefined && set.thumb != false ){
		var img_sent = $('.wmuf_thumb img', parent.document);
		if( img_sent.attr('src') !== undefined ){
			imgs = '<div class="wmuf_thumb" >';
			imgs += img_sent.parent().html();
			imgs += '</div>';
		}else{
			var imgs = '';
		}
		for( var i = 0; i < size; i++ ){
			var txt      = file.eq(i).text();
			var obj_file = JSON.parse(txt);
			imgs += '<div class="wmuf_thumb" >';
			imgs += '<img width="'+set.thumb_w+'" src="'+set.directory+obj_file.thumb+'" alt="Thumbnail" />';
			imgs += '</div>';
		}
		retorno += imgs;
	}

	// inserindo inputo no front
	var id    = new String(set.input_container);
	parent.jQuery('#'+id).html(retorno);

	// fechando o lightbox
    parent.jQuery("#wmuf_lb_box").fadeOut('fast', function(){
        $(this).remove();
    });
    parent.jQuery('#wmuf_lb').fadeOut('fast', function(){
        $(this).remove();
    });
    parent.jQuery("html, body").css({'overflow':'auto'});
	return false;
});

// retorna o tamanho do objeto
function get_size_object(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// deleta file via ajax
function ajax_delete( url, file ){
	var url = url
	$.ajax({
		type: "POST",
		url: url,
		data: { file : file }
	}).done(function( r ) {});
}