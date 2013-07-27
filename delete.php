<?php
$file = 'uploads/'.$_POST['file'];
if(is_file($file))
        @unlink($file);