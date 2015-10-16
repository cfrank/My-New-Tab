<!DOCTYPE html><html><head><title>Your Files!</title><style>*{margin:0;padding:0;box-sizing:border-box;outline:none}body{background-color:#F0F0F0}#document,#file{width:800px;height:auto;margin:50px auto}.image{background-color:#f3f3f3;border:20px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,0.07)}#document{background-image:url(assets/doc.png);background-color:#f3f3f3;background-position:center center;background-repeat:no-repeat;border:20px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,0.07)}#back{width:100px;height:100%;background-color:rgba(123,122,122,0.05);position:fixed;top:0;left:0;cursor:pointer;transition:all .4s ease}#back:hover{background-color:rgba(24,160,224,0.3)}</style></head><body><div onclick="back()" id="back"></div>
<?php
    // Establish the maximum file upload size (120MB)
    $max_file_size = 120 * 1024 * 1024;
    // The directory to upload files
    $path = "f";
    // Get the url of the file host
    $host = "http://www.cfrank.org";
    // The itorator
    $count = 0;
    
    // Function to create a random string
    function incrementalHash()
    {
        $seed       = str_split('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
        shuffle($seed);
        $result     = '';
        foreach (array_rand($seed, 6) as $k) $result .= $seed[$k];
        return $result;
    }
    
    if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST")
    {
        // Loop $_FILES to execute all files
        foreach ($_FILES['files']['name'] as $uploaded_file => $name)
        {
            $error_code = $uploaded_file["error"];
            
            // Synthesize the new file name
            $file_type = explode('.', basename($name));
            $file_type = end($file_type);
            $file_type = trim(strtolower($file_type));
            
            $file_name = incrementalHash();
            
            // Get full path of the file
            $new_file
            // Get current working directory
            = dirname(dirname(__FILE__))
            . DIRECTORY_SEPARATOR
            // Get url address of site
            . $path
            . DIRECTORY_SEPARATOR
            // Get the name of the file
            . $file_name
            . '.'
            // Get the type of the file
            . $file_type
            ;
            
            // Get url of the file
            $file
            // Get the host eg: http://www.cfrank.org
            = $host
            . DIRECTORY_SEPARATOR
            // Get the defined path above
            . $path
            . DIRECTORY_SEPARATOR
            // Get the name of the file
            . $file_name
            . '.'
            // Get the type of the file
            . $file_type
            ;
            
            // Get the file size
            $file_size = number_format($uploaded_file["size"]);
            
            if ($error_code == 4)
            {
                continue; // Skip file if any error found
            }
                   
            if ($_FILES['files']['error'][$uploaded_file] == 0)
            {
                if ($_FILES['files']['size'][$uploaded_file] > $max_file_size)
                {
                    echo "$name is too large!";
                    continue; // Skip large files
                }
                else
                {
                    // No error found! Move uploaded files
                    if(move_uploaded_file($_FILES["files"]["tmp_name"][$uploaded_file], $new_file))
                    {
                        // Array of supported image types by the <img> tag
                        $image_ext = Array('jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp');
                        // If the file is an image
                        if(in_array($file_type, $image_ext))
                        {
                            // Echo the image
                            echo '<div id="file"><a target="_blank" href="'. $file .'"><img class="image" src="'. $file .'" width="800"/></a></div>'; 
                        }
                        // If not
                        else
                        {
                            // Echo the document
                            echo '<div id="document" style="height: 800px !important;"><a style="display:block; width: 800px; height: 800px;" target="_blank" href="'. $file .'"></a></div>';   
                        }
                    }
                    $count++; // Number of successfully uploaded file
                }
            }
        }
    }
?><script>function back(){var url = document.location.origin + "/n/";window.location.href = url;}</script></body></html>