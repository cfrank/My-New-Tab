// Global var
var grabPage            = document.getElementById("container"),
    input               = document.getElementById("newLink"),
    customOne           = document.getElementById("customOne"),
    customTwo           = document.getElementById("customTwo"),
    customThree         = document.getElementById("customThree"),
    engineLink          = null,
    toggle              = 1,
    toggleEdit          = 1,
    lastElem            = "content-ln",
    currentLink         = "customOne",
    // LocalStorage Variables
    cfChangesMade       = false,
    cfCustomOneVal      = "",
    cfCustomTwoVal      = "",
    cfCustomThreeVal    = "";
function init()
{
    document.getElementById("q").focus();
    bubblingSpan();
    loadExecute();
}
// {{{ Build Search
var grabSearch          = document.getElementById("search"),
    search              = '<input type="text" id="q" value="" onpaste="query(event, this.value);" onkeypress="query(event, this.value);" autofocus autocomplete="off" />';
grabSearch.innerHTML    = search;
// }}}
// {{{ Search Engines
var engines = [
    //  [Key Code], [Search URL],   [Home Page Link],   [Favicon]
    ["",    "https://www.duckduckgo.com/?q=",                   "https://www.duckduckgo.com",       "http://www.cfrank.org/f/0RIxiU.ico"],
    ["!d",  "https://www.duckduckgo.com/?q=",                   "https://www.duckduckgo.com",       "http://www.cfrank.org/f/0RIxiU.ico"],
    ["!g",  "https://www.google.com/#q=",                       "https://www.google.com",           "https://www.google.com/favicon.ico"],
    ["!t",  "https://translate.google.com/?vi=",                "https://translate.google.com/",    "https://translate.google.com/favicon.ico"],
    ["!i",  "https://www.google.com/search?tbm=isch&q=",        "https://www.images.google.com",    "https://www.google.com/favicon.ico"],
    ["!y",  "https://www.youtube.com/results?search_query=",    "https://www.youtube.com",          "https://youtube.com/favicon.ico"],
    ["!w",  "https://en.wikipedia.org/w/index.php?search=",     "https://www.en.wikipedia.org",     "http://en.wikipedia.org/favicon.ico"]
];
// }}}
// {{{ Handle Search
function query(e, v)
{
    var key         = e.keyCode || e.which,
        input       = document.getElementById("q");
    // Search Engine
    if(v.length === 2 && key !== 13 && v.lastIndexOf("!") !== -1)
    {
        var en = v.lastIndexOf("!"); // Engine Selected
        for(var i = 0; i < engines.length; ++i)
        {
            if(engines[i][0] === v.substr(en))
            {
                e.preventDefault(); // Remove the leading space on the query
                engineLink                  = engines[i][1];
                var engineIcon              = '<a href="' + engines[i][2] + '"><img src="' + engines[i][3] + '" width="16" height="16" /></a>',
                    grabFavIcon             = document.getElementById("favicon");
                grabFavIcon.innerHTML       = engineIcon;
                grabFavIcon.style.opacity   = "1";
                input.value = "";
            }
        }
    }
    // On enter
    if(key === 13)
    {
        if(engineLink != null && engineLink === engines[2][1])
        {
            var lang    = ["ru", "en"];
            if(v.match(/^[\x20-\x7E]+$/))
            {
                // English Language ~ EN - RU
                window.location = engineLink + 'c#' + lang[1] + '/' + lang[0] + '/' + v;
            }
            else if(v.match(/[\u0400-\u04FF]/))
            {
                // Russian Language ~ RU - EN
                window.location = engineLink + 'c#' + lang[0] + '/' + lang[1] + '/' + v;
            }
            else
            {
                // Unknown Language ~ AU - EN
                window.location = engineLink + 'c#auto/en/' + v;
            }
        }
        else if(engineLink != null && engineLink === engines[3][1])
        {
            var url     = "https://www.google.com/searchbyimage?image_url=",
                pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                // Is not a link
                if(!pattern.test(v))
                {
                    window.location = engineLink + v;
                }
                // Is a link
                else
                {
                    window.location = url + v;
                }
        }
        else if(engineLink != null)
        {
            window.location = engineLink + v;
        }
        else
        {
            window.location = engines[0][1] + v;
        }
    }
}
// }}}
// {{{ Preload Favicons
function preloader()
{
    if(document.images)
    {
        var img1    = new Image();
        var img2    = new Image();
        var img3    = new Image();
        var img4    = new Image();
        
        img1.src    = engines[0][3];
        img2.src    = engines[2][3];
        img3.src    = engines[4][3];
        img4.src    = engines[5][3];
    }
}
function addLoadEvent(func)
{
    var oldonload = window.onload;
    if(typeof window.onload != 'function')
    {
        window.onload = func;
    }
    else
    {
        window.onload = function()
        {
            if(oldonload)
            {
                oldonload()
            }
            func();
        }
    }
}
addLoadEvent(preloader);
// }}}
// {{{ Handle the clicking of Span tags
function bubblingSpan()
{
    [].forEach.call(document.querySelectorAll('span'), function(el)
    {
        el.addEventListener('click', function()
        {
            // Get parent element
            var pn = el.parentNode;
            spanClicked(el.className, pn.id, el.id);
        }, false);
    });
}
// }}}
// {{{ Handle the clicking of edit divs
var editLinkButtons = document.getElementsByClassName("editLinkToggle");
for(var inc = 0; inc < editLinkButtons.length; ++inc)
{
    var element = editLinkButtons[inc];
        element.onclick = function(el)
        {
            var idN = this.id;
            editLinkButtonClick(idN);
        }
}
// }}}
// {{{ Start editing links
document.getElementById("editLinks").onclick = function() { edit(); }
// }}}
// {{{ Show progress gif on form submit
document.getElementById("fu-form").onsubmit = function()
{
    var box = document.getElementById("fu-box");
    box.style.height    = "40px";
    box.style.opacity   = "1";
}
// }}}
// {{{ Load any and all Localstorage Variables (Custom Links
function loadExecute()
{
    cfChangesMade       = (localStorage["cfnewtab.changes.made"] === "true");
    if(!cfChangesMade){ return false;}
    cfCustomOneVal      = localStorage["cfnewtab.custom.one.value"];
    if(typeof cfCustomOneVal !== "undefined" && cfCustomOneVal.length > 0)
    {
        linkHTML(customOne, cfCustomOneVal);
    }
    cfCustomTwoVal      = localStorage["cfnewtab.custom.two.value"];
    if(typeof cfCustomTwoVal !== "undefined" && cfCustomTwoVal.length > 0)
    {
        linkHTML(customTwo, cfCustomTwoVal);
    }
    cfCustomThreeVal    = localStorage["cfnewtab.custom.three.value"];
    if(typeof cfCustomThreeVal !== "undefined" && cfCustomThreeVal.length > 0)
    {
        linkHTML(customThree, cfCustomThreeVal);
    }
}
// }}}
// {{{ Fork function for when a span tag is clicked
function spanClicked(nameOfClass, parentId, elemId)
{
    // Handle the clicking of header links
    if(nameOfClass === "anchor")
    {
        headerResponse(elemId);
        return false;  
    }
    // Handle the clicking of empty custom links
    else if(nameOfClass === "addLink")
    {
        currentLink = parentId;
        addLink(parentId);
        return false;
    }
}
// }}}
// {{{ Functionf or when a edit link box is clicked
function editLinkButtonClick(idN)
{
    if(idN === "editLink1")
    {
        localStorage["cfnewtab.custom.one.value"] = "";
        revertHTML("customOne");
    }
    else if(idN === "editLink2")
    {
        localStorage["cfnewtab.custom.two.value"] = "";
        revertHTML("customTwo");
    }
    else if(idN === "editLink3")
    {
        localStorage["cfnewtab.custom.three.value"] = "";
        revertHTML("customThree");
    }
    killPop(2);
    bubblingSpan();
}
// }}}
// {{{ Find span tag id for header links and send it to next function
function headerResponse(id)
{
    var idOfContent = "content-" + id; 
    addHeaderClass(idOfContent);
}
// }}}
// {{{ Display popup and overlay
function addLink(id)
{
    var overlay = document.getElementById("overlay"),
        pop     = document.getElementById("addLinksPop");
    overlay.style.display   = "block";
    pop.style.display       = "block";
    input.focus();
}
// }}}
// {{{ Handle showing and hiding tabs
function addHeaderClass(contentId)
{
    var elem        = document.getElementById(contentId),
        className   = "show",
        prevElem    = document.getElementById(lastElem);
        
    if(contentId === lastElem)
    {
        // If clicking on active header link stop!
        return false;
    }
    else
    {
        elem.classList.toggle("show");
        prevElem.classList.remove("show");
        lastElem = contentId;
    }
}
// }}}
// {{{ Handle saving links and checking/setting cfChangesMade variable
function saveLink(e, v)
{
    var key = e.keyCode || e.which;
    // TODO: Check for valid Link
    if(key === 13 && v.length > 1)
    {
        if(currentLink === "customOne")
        {
            localStorage["cfnewtab.custom.one.value"] = v;
        }
        else if(currentLink === "customTwo")
        {
            localStorage["cfnewtab.custom.two.value"] = v;
        }
        else if(currentLink === "customThree")
        {
            localStorage["cfnewtab.custom.three.value"] = v;
        }
        // Changes have been Made
        if(!cfChangesMade)
        {
            cfChangesMade = true;
            localStorage["cfnewtab.changes.made"] = cfChangesMade;
        }
        input.value = "";
        killPop(1);
        loadExecute();
    }
    else
    {
        return false;
    }
}
// }}}
// {{{ Function to start editing process
function edit()
{
    var overlay = document.getElementById("overlay"),
        pop     = document.getElementById("editLinksPop");
    overlay.style.display   = "block";
    pop.style.display       = "block";
}
// }}}
// {{{ Function to return the block of HTML for the custom Link
function linkHTML(elem, value)
{
    return elem.innerHTML = [
        '<div class="customLink">',
        '<a href="' + link(value, "link") + '">' + link(value, "client") + '</a>',
        '</div>'
    ].join('');
}
// }}}
// {{{ Function to return the custom link box to it's orig. state after edit
function revertHTML(elem)
{
    elem = document.getElementById(elem);
    return elem.innerHTML = '<span class="addLink">+</span>';
}
// }}}
// {{{ Handle displaying links and creating a tags values for custom links
function link(l, linkType)
{
    var pat = /^https?:\/\//i;
    if(linkType === "link" && !pat.test(l))
    {
        l = "http://" + l;
        return l;
    }
    else if(linkType === "client" && pat.test(l))
    {
        // If "http://" replace with ''
        l = l.replace('http://', '');
        // If "https://" replace with ''
        l = l.replace('https://', '');
        // If "www." replace with ''
        l = l.replace('www.', '');
        return l;
    }
    else{
        return l;
    }
}
// }}}
// {{{ Close popup
function killPop(pop)
{
    var overlay = document.getElementById("overlay"),
        popLink = document.getElementById("addLinksPop"),
        popEdit = document.getElementById("editLinksPop");
    overlay.style.display = "none";
    if(pop === 1)
    {
        popLink.style.display = "none";   
    }
    else if(pop === 2)
    {
        popEdit.style.display = "none";
    }
}
// }}}