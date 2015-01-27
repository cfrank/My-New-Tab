<?php
    // Set default timezone for "bug" reasons
    date_default_timezone_set("GMT"); 
    /*
        -Define constant variables
        &
        Open and read JSON-  
    */
    // API string for Weather Underground 
    $api_string         = "22042a7b11ba0a0a";
    // Put the getIP() function into a variable
    $user_ip            = getIP();
    // URL of the api
    $url_address        = "http://api.wunderground.com/api/$api_string/geolookup/conditions/q/autoip.json?geo_ip=$user_ip";
    // Get JSON response from WU
    $json_string        = file_get_contents($url_address);
    // Parse JSON
    $parsed_json        = json_decode($json_string);
    // Get city
    $city               = $parsed_json->{'location'}->{'city'};
    // Get Country
    $country            = $parsed_json->{'location'}->{'country_name'};
    // Create location string
    $location_string    = "$city, $country";
    // Get LAT/LON for use with date_sunset() function
    $lat                = $parsed_json->{'location'}->{'lat'};
    $lon                = $parsed_json->{'location'}->{'lon'};
    // Get display forcast (EG: Overcast)
    $forcase_string     = $parsed_json->{'current_observation'}->{'weather'};
    // Get Temperature (c)
    $temp_c             = $parsed_json->{'current_observation'}->{'temp_c'};
    // Get Temperature (f)
    $temp_f             = $parsed_json->{'current_observation'}->{'temp_f'};
    // Get icon name (Used for icon font class)
    $icon_string        = $parsed_json->{'current_observation'}->{'icon'};
    // Define the final font class which will be assigned later
    $final_font_class   = "climacon ";
    
    /*
        -Start processing-
    */
    
    // Check if day or night (depending on sunrise/sunset)
    function dayOrNight()
    {
        // Find time of sunrise
        $sunrise    = date_sunrise(time(), SUNFUNCS_RET_DOUBLE, $lat, $lon, 96, 0);
        // Find time of sunset
        $sunset     = date_sunset(time(), SUNFUNCS_RET_DOUBLE, $lat, $lon, 96, 0);
        // Find current time
        $now        = date("H") + date("i") / 60 + date("s") / 3600;
        if ($sunrise < $sunset)
                if (($now > $sunrise) && ($now < $sunset)) return "sun";
                else return "moon";
        else
                if (($now > $sunrise) || ($now < $sunset)) return "sun";
                else return "moon"; 
    }
    // Function to get IP of user for use in WU URL
    function getIP()
    {
        if (!empty($_SERVER["HTTP_CLIENT_IP"]))
        {
         //check for ip from share internet
         return $_SERVER["HTTP_CLIENT_IP"];
        }
        elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"]))
        {
         // Check for the Proxy User
         return $_SERVER["HTTP_X_FORWARDED_FOR"];
        }
        else
        {
         return $_SERVER["REMOTE_ADDR"];
        }
    }
    // Find icon to use
    switch($icon_string)
    {
        case "chanceflurries":
        case "flurries":
            $final_font_class .= "flurries ";
            break;
        case "chancerain":
        case "rain":
            $final_font_class .= "rain ";
            break;
        case "chancesleet":
        case "sleet":
            $final_font_class .= "sleet ";
            break;
        case "chancesnow":                 
        case "snow":
            $final_font_class .= "snow ";
            break;
        case "chancetstorms":
        case "tstorms":
            $final_font_class .= "lightning ";
            break;
        case "clear":
        case "cloudy":
        case "mostlycloudy":
        case "partlycloudy":
            $final_font_class .= "cloud ";
            break;
        case "flurries":
            $final_font_class .= "flurries ";
            break;
        case "fog":
            $final_font_class .= "fog ";
            break;
        case "hazy":
            $final_font_class .= "haze ";
            break;
        case "mostlysunny":
        case "partlysunny":
        case "sunny":
            $final_font_class .= "sun ";
            break;
        case "unknown":
            $final_font_class .= "cloud refresh ";
            break;
    }
    // Put the result of dayOrNight() into a variable
    $sunOrMoon = dayOrNight();
    // Add it to the final_font_class
    $final_font_class .= $sunOrMoon;
    // Create the html variable which will hold the output html
    $html = null;
    // Add it it
    $html .= '<div id="inner-wt" class="inner-content">';
    $html .= '<div id="weather-title">Weather for '.$location_string.'</div>';
    $html .= '<div id="weather-content" class="clearfix">';
    $html .= '<span class="float '.$final_font_class.'"></span>';
    $html .= '<span class="float tempC">'.$temp_c.'<span class="deg small">&deg;C</span></span>';
    $html .= '<span class="float tempF">'.$temp_f.'<span class="deg">&deg;F</span></span>';
    $html .= '</div>';
    $html .= '<span class="forecast">'.$forcase_string.'</span>';
    $html .= '</div>';
    // Echo html
    echo $html;
?>