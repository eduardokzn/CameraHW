// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");


    // I ONLY NEED TO ACCESS THE FILE SYSTEM ONCE
    // SO WE REQUEST THIS STRAIGHT AWAY AS SOON AS
    // THE PROGRAM IS LOADING
    tryingFile();
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})

function tryingFile(){

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
   
}

function fileSystemCallback(fs){

    // Name of the file I want to create
    // IN THIS CASE A JPG FILE!!
    var fileToCreate = "newPersistentPic.jpg";

    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

// NOW, THE GETFILECALLBACK IS NOT GOING
// TO CALL THE READ OR THE WRITE FUNCTIONS 
// AUTOMATICALLY. THIS WILL BE DONE BY THE
// BUTTON ON THE FRONT END
// THE IMPORTANT PART HERE IS TO PUT THE 
// FILE ENTRY SOMEWHERE FOR ALL OTHER FUNCTIONS
// TO FIND
var entry;
function getFileCallback(fileEntry){
    
    entry = fileEntry;

}

// THE WRITEPIC FUNCTION DOES NOT NEED TO
// RECEIVE THE FILE ENTRY BECAUSE IT CAN
// ACCESS IT DIRECTLY IN THE GLOBAL SCOPE VARIABLE
function writePic(dataObj) {

    // THIS IS IMPORTANT, THIS IS THE GLOBAL VARIABLE
    entry.createWriter(function (fileWriter) {

        // SAVING WHATEVER OBJECT IS PASSED FROM OUTSIDE
        fileWriter.write(dataObj);

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

    });
}

// TO OPEN THE PICTURE, AGAIN WE DON'T NEED TO
// PASS THE FILE ENTRY, BECAUSE EVERYONE CAN SEE
// THE FILE ENTRY IN THE GLOBAL VARIABLE
function readPic() {

    // AND AGAIN, I USE THE GLOBAL VARIBLE EVERYONE IS SEEING
    entry.file(function (file) {
        
        // Create the reader
        var reader = new FileReader();

        // READ THE FILE AS A BINARY STRING
        reader.readAsBinaryString(file);

        reader.onloadend = function() {

            console.log("Successful file read: " + this.result);
            console.log("file path: " + entry.fullPath);

            // AND PUT THE RESULT IN THE FRONT END
            document.getElementById('display').src = reader.result;

        };

    }, onError);
}

function onError(msg){
    console.log(msg);
}

// NOW, TAKING THE PICTURE IS THE SAME
function pics(){
	navigator.camera.getPicture(cameraCallback, onError);
}

// BUT THE CALLBACK, INSTEAD OF DISPLAYING THE PIC
// IS GOING TO SAVE IT USING THE WRITEPIC FUNCTION
// AND PASSING A BLOB OBJECT!
function cameraCallback(imageData) {
    
    var dataObj = new Blob([imageData], { type: 'image/jpeg' });
    
    writePic(dataObj);

}
