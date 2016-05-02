/* Global variables */
var useSearch       = true, // Should there be a search bar present?
    engineLink      = null, // This is the search engine query link
    currentItem     = null, // The currently changing LI
    currentIndex    = null; // The currentItems index in the <ul> stack 


/* Constants */
const K_ESC   = 27; // Escape key
const K_ENTER = 13; // Enter keycode
const K_SPACE = 32; // Space keycode


/**
 * Keycode function
 *
 * @desc    Gets the keycode from the keyboard event
 *
 * @param   {Object}        The keyboard event
 *
 * @return  {INT}
 */
 
function getKeycode(event)
{
    if(!event) event = window.event;
    return event.keyCode || event.which;
}

/**
 * Initial function fire
 *
 * @desc    Loads functions on page load that
 *          aren't fired from an event.
 */

document.addEventListener('DOMContentLoaded', function()
{
    // Sets the background
    background();
    // Initialize the search bar
    initSearch(useSearch);
    
    /* These events are for the links */
    
    // Add event listeners to custom links
    bubblingSpan();
    
    // Check for and set any custom links
    initLinks();
    
    return 1;
});

/**
 * Popup close
 *
 * @desc    Closes the popup and removes the overlay
 */

document.addEventListener('keydown', function(event)
{
    var keyCode = getKeycode(event);
    if(keyCode !== K_ESC || document.getElementById('overlay').style.display === 'none')
    {
        return;
    }
    else
    {
        closePopUp();
    }
});

/**
 * Background setter
 *
 * @desc    Sets the page background based on
 *          an array of image files.
 */

function background()
{
    var grabPage    = document.getElementById('page'),
        // Background file array
        backgrounds = [
            'assets/img/bg/background1.jpg',
            'assets/img/bg/background2.jpg',
            'assets/img/bg/background3.jpg',
            'assets/img/bg/background4.jpg',
            'assets/img/bg/background5.jpg',
            'assets/img/bg/background6.jpg'
        ],
        bgMaxLength = backgrounds.length,
        // Get a random number between 0 and backgroundMaxNumber
        randomInt   = Math.floor(Math.random()*(bgMaxLength) + 0);
    
    // Add the image to the page
    grabPage.style.backgroundImage = 'url(' + backgrounds[randomInt] + ')';
}

/**
 * Initialize search
 *
 * @desc    Adds the search bar to the page and makes
 *          necessary style changes
 *
 * @param   {BOOL}  Should we use the search bar?
 */
 
function initSearch(useSearch)
{
    // Get the search div
    var grabSearch = document.getElementById('search');
    
    if(useSearch)
    {
        // Create the search bar in HTML
        var searchHTML = '<input type="text" id="q" value="" autofocus autocomplete="off" />';
        
        // Add the searh bar to the page
        grabSearch.innerHTML = searchHTML;

        // Add an event listener on the search bar
        document.getElementById('q').addEventListener('keypress', function(e)
        {
            query(e, this.value);
        });
        
        // Focus on the newly created search bar (Must be last)
        document.getElementById('q').focus();
    }
    else
    {
        // Remove the height css from the search div
        grabSearch.style.height = '0px';
        // Remove the margin top on the links container
        document.getElementById('links-container').style.marginTop = '0px';
        // Output that we are not using the search bar
        console.log('Not using Search bar');
    }
}

/**
 * Search query function
 *
 * @desc    Takes every keypress from the search bar
 *          and figures out what to do with it.
 *
 * @param   {OBJECT}    The keyboard event
 * @param   {STRING}    The string which was sent from the
 *                      search bar
 */

function query(event, value)
{   
    var keyCode = getKeycode(event),
        input = document.getElementById('q');
    
    // Search Engines
    var engines = [
        //  [Key Code], [Search URL],   [Home Page Link],   [Favicon]
        ['',    'https://www.google.com/#q=',                       'https://www.google.com',           'https://www.google.com/favicon.ico'],
        ['!d',  'https://www.duckduckgo.com/?q=',                   'https://www.duckduckgo.com',       'https://duckduckgo.com/favicon.ico'],
        ['!g',  'https://www.google.com/#q=',                       'https://www.google.com',           'https://www.google.com/favicon.ico'],
        ['!t',  'https://translate.google.com/?vi=',                'https://translate.google.com/',    'https://translate.google.com/favicon.ico'],
        ['!i',  'https://www.google.com/search?tbm=isch&q=',        'https://www.images.google.com',    'https://www.google.com/favicon.ico'],
        ['!y',  'https://www.youtube.com/results?search_query=',    'https://www.youtube.com',          'https://youtube.com/favicon.ico'],
        ['!w',  'https://en.wikipedia.org/w/index.php?search=',     'https://www.en.wikipedia.org',     'http://en.wikipedia.org/favicon.ico']
    ];
    
    // Check if the user is requesting a search engine
    if(value.length === 2 && keyCode === K_SPACE && value.lastIndexOf('!') !== -1)
    {
        for(var i = 1; i <= engines.length - 1; ++i)
        {
            // Check if the user key code is that of an existing one
            if(engines[i][0] === value)
            {
                event.preventDefault(); // Prevent adding a space being added to the query
                engineLink = engines[i][1]; // Change the engineLink to the new search engine
                var engineIcon = '<a href="' + engines[i][2] + '"><img src="' + engines[i][3] + '" width="16" height="16" /></a>',
                    grabFavIcon = document.getElementById('favicon');
                
                grabFavIcon.innerHTML = engineIcon; // Add the favicon to the page
                input.value = ''; // Clear the input
                
                return 1; // Return true so it doesn't keep looping through the entire SE list
            }
        }
    }
    
    
    if(keyCode === K_ENTER)
    {
        // If the user has not changed the search engine
        if(engineLink === null){
            window.location.href = engines[0][1] + value;
        }
        // If the user has changed the search engine
        else
        {
            // If the search engine is not google translate or google images
            if(engineLink !== engines[3][1] && engineLink !== engines[4][1])
            {
                window.location.href = engineLink + value;
            }
            // If the search engine link is google translate
            else if(engineLink === engines[3][1])
            {
                var lang = ['ru', 'en'];
                // If the string is russian
                if(/[а-яА-ЯЁё]/.test(value))
                    window.location.href = engineLink + 'c#' + lang[0] + '/' + lang[1] + '/' + value;
                else
                    window.location.href = engineLink + 'c#auto/ru/' + value;
            }
            else if(engineLink === engines[4][1])
            {
                var url = 'https://www.google.com/searchbyimage?image_url=',
                    linkTest = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                    
                if(linkTest.test(value))
                    window.location.href = url + value;
                else
                    window.location.href = engineLink + value;
            }
            else
            {
                // What the hell happened?
                alert('ERROR: EngineLink is a incorrect value!!');
                console.log('ERROR: EngineLink is a incorrect value!!');
                return 0;
            }
        }
    }
}

/**
 * Custom Link Event Listeners
 *
 * @desc    Add event listeners to all custom links
 */
 
function bubblingSpan()
{
    // Get the container of the links
    var customUL = document.getElementById('custom-links-list');
    
    Array.prototype.forEach.call(customUL.children, function(el)
    {
        // Add an event listener to all the children of customUL
        el.addEventListener('click', function()
        {
            // If the element contains a custom link don't open the pop-up
            if(el.childNodes[0].nodeName === 'A')
                return;
            
            // Get the index value of the custom-link inside the parent.
            var childIndex  = Array.prototype.indexOf.call(this.parentNode.children, this),
                listItem    = customUL.children[childIndex];
            
            // Save these variables globally for use later
            currentItem     = listItem;
            currentIndex    = childIndex;
            
            // Function to create the popup and add the link
            openPopUp(1, 'Add a link');

            return true;
        });
    });
}

/**
 * Open edit popup
 *
 * @desc    Add an event listener to the edit button and open
 *          the edit popup.
 */
 
document.getElementById('js-link-edit').addEventListener('click', function()
{
    openPopUp(2, 'Edit a link');
});

/**
 * Initiate Links
 *
 * @desc    Check for and set any custom links
 */
 
function initLinks()
{
    // If there has been no changes then do nothing
    if(localStorage.getItem('cf-newtab-changes-made') === null)
        return;
        
    // For each of the 3 custom links, check if it's been set
    for(var i = 0; i < 3; ++i)
    {
        // Check for a localstorage item for this custom link
        if(localStorage.getItem('cf-newtab-custom-link-' + i) !== null)
        {
            var parsedContent   = JSON.parse(localStorage.getItem('cf-newtab-custom-link-' + i)),
                customIds       = ['custom-one', 'custom-two', 'custom-three'];
            var htmlContent = [
                '<a id="hello" href="' + parsedContent[0] + '" title="' + parsedContent[0] + '">' + parsedContent[1] + '</a>'
            ];
            document.getElementById(customIds[i]).innerHTML = htmlContent;
        }
    }
}

/**
 * Open a popup
 *
 * @desc    Opens a popup and adds the appropriate content
 *
 * @param   {INT}           Determines the type of popup (1: Add link, 2: Edit link)
 * @param   {STRING}        The string to put into the title
 */
 
function openPopUp(type, titleContent)
{
    var overlay = document.getElementById('overlay'),
        popup   = document.getElementById('popup'),
        popcont = document.getElementById('popup-container-out'),
        title   = document.getElementById('pop-title'),
        cont    = document.getElementById('pop-container');
    
    // Unhide all the divs
    overlay.style.display = 'block';
    popup.style.display = 'block';
    popcont.style.display = 'block';
    
    // Add the title
    title.innerHTML = titleContent;
    
    // Add link
    if(type === 1)
    {
        // Add content
        var content = [
            '<input type="text" id="newLink" placeholder="Yandex.ua" autofocus autocomplete="off" />'
        ];
        
        cont.innerHTML  = content;
        
        /*
            If running this site inside a Google Chrome Extension their security
            settings will not allow you to make use of the 'onkeypress' inline script
            inside the input tag.
        */
        document.getElementById('newLink').onkeypress = function(e)
        {
            saveLink(e, this.value);
        }
        
        // Focus on the new input field
        document.getElementById('newLink').focus();
    }
    else if(type === 2)
    {
        var content = [
            '<ul id="edit-links-ul">',
            '<li class="edit-link">1</li>',
            '<li class="edit-link">2</li>',
            '<li class="edit-link">3</li>',
            '</ul>'
        ].join('');
        
        cont.innerHTML = content;
        
        bubblingEditLinks();
    }
    /*
        Add an event listener on the overlay to allow
        closing of the popup
    */
    document.getElementById('overlay').addEventListener('click', function()
    {
        closePopUp();
    });
}

/**
 * Bubbling function for edit links
 *
 * @desc    Add an event listener to all the edit links
 *          And fire a remove custom link function on that link.
 */
 
function bubblingEditLinks()
{
    var elementUl = document.getElementById('edit-links-ul');
    
    Array.prototype.forEach.call(elementUl.children, function(el)
    {
        el.addEventListener('click', function()
        {
            var childIndex = Array.prototype.indexOf.call(this.parentNode.children, this);
            
            removeCustomLink(childIndex);
        });
    });
}

/**
 * Close a popup
 *
 * @desc    Closes a popup and removes content
 */

function closePopUp()
{
    var overlay = document.getElementById('overlay'),
        popup   = document.getElementById('popup'),
        popcont = document.getElementById('popup-container-out');
    
    overlay.style.display = popup.style.display = popcont.style.display = 'none';
    
    // Clear memory
    document.getElementById('pop-container').innerHTML = null;
    document.getElementById('pop-title').innerHTML = null;
}

/**
 * Saves the users custom link
 *
 * @desc    This even is fired on keypress inside the newLink
 *          form field. This will only do anything if the user
 *          hits the enter key though.
 *
 * @param   {Object}        The keyboard event
 * @param   {STRING}        The value of the input field
 */
 
function saveLink(event, value)
{
    var keyCode = getKeycode(event);

    // If the user hits enter send the value to be saved into localhost
    if(keyCode === K_ENTER)
        setCustomLink(value);
    else
        return;
}

/**
 * Remove Custom link
 *
 * @desc    Remove a custom link & update localStorage
 *
 * @param   {INT}    The links index in it's parent
 */

function removeCustomLink(linkIndex)
{
    // Set up an array with the custom links urls
    var customLinkIds = ['custom-one', 'custom-two', 'custom-three'];
    
    // Remove the custom link from local storage
    localStorage.removeItem('cf-newtab-custom-link-' + linkIndex);
    
    // Variable with the default html for the custom link
    var defaultHTML = [
        '<span class="addLink">+</span>'
    ];
    
    // Remove the custom url from the page without needing reload
    document.getElementById(customLinkIds[linkIndex]).innerHTML = defaultHTML;
    
    closePopUp();
}

/**
 * Validates the users link
 *
 * @desc    Checks to make sure the 
 *
 * @param   {STRING}    The users input
 */
 
function setCustomLink(userInput)
{
    var linkTest = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
        userLink = null, // The valid external link
        dispLink = null; // The string to display to the user
        
    if(linkTest.test(userInput))
    {
        userLink = userInput;
    }
    else
    {
        // Check if it begins with www.
        if(userInput.substring(0, 4) === 'www.')
        {
            var testLink = 'http://' + userInput;
            
            if(linkTest.test(testLink))
                userLink = testLink;    
        }
    }
    
    if(userLink === null)
    {
        alert('Please enter a valid link (http://www.google.com)'); 
        return false;
    }
    // From now we can assume the link is semi-correct
    else
    {
        // Remove any link infomation (http, https, www)
        var disallowed = ['http://', 'https://', 'www.'];
        for(var i = 0; i < disallowed.length; ++i)
        {
            if(dispLink === null)
                dispLink = userLink.replace(disallowed[i], '');
            else
                dispLink = dispLink.replace(disallowed[i], '');
        }
        
        // Create the custom link html
        var customLinkHtml = [
            '<a href="' + userLink + '" title="' + userLink + '">' + dispLink + '</a>'
        ];
        
        // Add to the HTML
        currentItem.innerHTML = customLinkHtml;
        
        // Run localstorage function to save the link
        setCusomLinkLocalStorage(userLink, dispLink);
        
        // Close the pop-up
        closePopUp();
    }
}

/**
 * Set custom link local storage
 *
 * @desc    Sets the localstorage variable for the current custom link 
 *
 * @param   {STRING}    The link for the custom link
 * @param   {STRING}    The text which will describe the link
 */
 
function setCusomLinkLocalStorage(userLink, dispLink)
{
    // If the changes made localstorage variable is not set, set it
    if(localStorage.getItem('cf-newtab-changes-made') === null)
        localStorage.setItem('cf-newtab-changes-made', 'true')
    
    // Create an array of the content which makes up the link
    var customLinkData = [userLink, dispLink];
    
    /*
        Set the localstorage variable for the userLink
        
        LocalStorage doesn't accept arrays so you need to stringify the array
        and get it's contents with JSON.parse
    */
    localStorage.setItem('cf-newtab-custom-link-' + currentIndex, JSON.stringify(customLinkData));
}