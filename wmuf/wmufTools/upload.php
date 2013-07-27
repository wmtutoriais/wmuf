<?php
try{
	if( move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/'.$_FILES['file']['name']) ){
		$arr = array('name'=>$_FILES['file']['name'], 'thumb'=>$_FILES['file']['name']);
		echo json_encode ($arr);
	}else{
		echo 'false';
	}
}catch(Exception $e){
	echo 'false';
}