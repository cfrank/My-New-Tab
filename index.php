<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name=viewport content="width=device-width, initial-scale=1">
<title>New Tab ~</title>
<!-- Stylesheets @ Main & Icon font -->
<link href="assets/style.css" rel="stylesheet" />
<link href="assets/icon-font.css" rel="stylesheet" />
</head>
<!-- Initiate onload scripts -->
<body onload="init()">
<!-- Overlay && Popups -->
<div id="overlay">
    <!-- Popup for adding links -->
    <div id="addLinksPop" class="a-vert">
        <div id="add-links-content" class="a-vert">
            <input type="text" id="newLink" placeholder="Yandex.ua" onkeypress="saveLink(event,this.value)" autofocus autocomplete="off" />
            <p><i>Press enter to save</i></p>
        </div>
        <div id="closePop" onclick="killPop(1)">Close <span id="pop-close">X</span></div>
    </div>
    <!-- Popup for editing links -->
    <div id="editLinksPop" class="a-vert">
        <div id="edit-links-content" class="a-vert clearfix">
            <div id="editLink1" class="editLinkToggle">1</div>
            <div id="editLink2" class="editLinkToggle">2</div>
            <div id="editLink3" class="editLinkToggle">3</div>
        </div>
        <div id="closePop" onclick="killPop(2)">Close <span id="pop-close">X</span></div>
    </div>
</div>
<!-- Start Page -->
<div id="container">
    <div id="innerCont" class="a-vert">
        <!-- Where the favicon is placed with Javascript -->
        <span id="favicon"></span>
        <!-- Where the search input field is places with Javascript -->
        <div id="search"></div>
        <!-- The start of the bottom section -->
        <div id="inner">
            <!-- The tabs -->
            <div id="head">
                <span id="ln" class="anchor">Links</span>
                <span id="fu" class="anchor">File Upload</span>
                <span id="fb" class="anchor">Weather</span>
            </div>
            <div id="content">
                <!-- Links -->
                <div id="content-ln" class="show">
                    <div class="inner-content">
                        <!-- Fixed links -->
                        <div id="top-row-links" class="clearfix">
                            <div class="link">
                                <a href="http://www.vk.com"><img src="assets/vk.png" height="100" width="100" alt="Logo of ВКонтакте" /></a>
                            </div>
                            <div class="link">
                                <a href="http://www.facebook.com"><img src="assets/fb.png" height="100" width="100" alt="Logo of Facebook" /></a>
                            </div>
                            <div class="link">
                                <a href="http://www.translate.google.com"><img src="assets/trans.png" height="100" width="100" alt="Logo of Google Translate" /></a>
                            </div>
                        </div>
                        <!-- Custom user-set links -->
                        <div id="bottom-row-links" class="clearfix">
                            <div class="link" id="customOne">
                                <span class="addLink">+</span>
                            </div>
                            <div class="link" id="customTwo">
                                <span class="addLink">+</span>
                            </div>
                            <div class="link" id="customThree">
                                <span class="addLink">+</span>
                            </div>
                        </div>
                    </div>
                    <!-- Button for editing links -->
                    <div id="editLinks">
                        <span id="editInner">Edit</span>
                    </div>
                </div>
                <!-- File upload -->
                <div id="content-fu" class="a-vert">
                    <div class="inner-content" id="inner-fu">
                        <div id="fu-box">
                            <img id="imageLoading" src="assets/progress.gif" width="470" height="40" alt="Please wait..." />
                        </div>
                        <form id="fu-form" action="upload-file.php" method="post" enctype="multipart/form-data">
                            <label for="select-file">
                                <img src="assets/upload.png" height="125" width="100" alt="Upload your images!" />
                            </label>
                            <input id="select-file" type="file" name="files[]" multiple="multiple">
                            <input id="fu-submit" type="submit" value="Upload →">
                            <p>Max file size 120MB - All formats Valid</p>
                        </form>
                    </div>
                </div>
                <!-- Where the weather is placed using PHP -->
                <div id="content-fb" class="a-vert">
                    <?php include 'assets/weather.php'; ?>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Javascript file -->
<script src="assets/app.js"></script>
</body>
</html>