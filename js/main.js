/*

xServiceWorker Js

------------------------------------ */
// Register the ServiceWorker
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./service-worker.js', {
    scope: '.'
  }).then(function(registration) {
  	// registration worker
      console.log('Registration successful. Scope is ' + registration.scope);

  }, function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
  });
}

self.addEventListener('install', function(event) {
  // Skip the 'waiting' lifecycle phase, to go directly from 'installed' to 'activated', even if
  // there are still previous incarnations of this service worker registration active.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  // Claim any clients immediately, so that the page will be under SW control without reloading.
  event.waitUntil(self.clients.claim());
});

/*

xMain Script

------------------------------------ */

jQuery(document).ready(function($){

//Check if online  
  if(navigator.onLine) { 
  console.log('Online');
} else {
  theNotification('Your connection maybe unstable but you can continue working!', 'Moments Manager');
}


//Get the current date
var today = new Date(); 
var date = today.getDate()+'/'+ (today.getMonth()+1)+'/'+ today.getFullYear();
$('.timerBtn span').text(date);

// Check if any projects are visible
checkContainer();

//Timer funtions
$(".recordBtn").on('click', function() {
  $(this).addClass('hiddenBtn');
  $('.stop_pause').removeClass('hiddenBtn');
  $(".t_header_time").timer({
    format: '%H:%M:%S' 
  });
  var states = $('.t_header_time').data('state');
  console.log("The timer is currently " + states);
});

$(".pauseBtn").on('click', function() {
  $(this).addClass('hiddenBtn');
  $('.t_header_time').timer('pause');
  $(".resumeBtn").removeClass('hiddenBtn');
});

$(".resumeBtn").on('click', function() {
  $('.t_header_time').timer('resume');
  $(".resumeBtn").addClass('hiddenBtn');
  $(".pauseBtn").removeClass('hiddenBtn');
});

$(".stopBtn").on('click', function(event) {
  event.preventDefault();
  $('.t_header_time').timer('remove');
  $('.stop_pause').addClass('hiddenBtn');
  $('.newProjectBtn').removeClass('hiddenBtn');
  $('.time_title').html('Start A New Project');
  $('.t_header_msg').html('You have nothing to do.' + '<br>' + 'Start a new project.');
  $(".t_header_time").addClass('hiddenBtn');
});

// Check if any projects are visible yet
function checkContainer () {
  if($('.single_project td').is(':visible')){ //if the projects are visible
      totalProjects();
      getTimeAndSalary();
      getProjectId();
  } else {
    setTimeout(checkContainer, 50); //wait 50 ms, then try again
  }
}


}); //End Ready


/*

x Project Information eg, project names, times, salaries. Only run if a project is visible

------------------------------------ */

//Show single project in modal
function getProjectId () {
//Add class .project_selected to table row when that table row is clicked
$('.projects_table tbody tr').click(function(e){
      $(this).addClass('project_selected');
      $(this).attr('data-target','#singleProject');
      $(this).attr('data-toggle','modal');
      //get project data from table
      var theProId = $('.project_selected .project_id').text();
      var theProName = $('.project_selected .project_name').text();
      var theProCli = $('.project_selected .client').text();
      var theProDes = $('.project_selected .description').text();
      var theProLoc = $('.project_selected .location').text();
      var theProRate = $('.project_selected .hourlyRate').text();
      var theProSal = $('.project_selected .salary').text();
      var theProTime = $('.project_selected .totalTime').text();
      var theProDate = $('.project_selected .pDate').text();

      var showPData =
        "<div class=\"t_content\" style=\"padding:0;\">" +
        "<table class=\"table-responsive\" style=\"width:100%\">" +
          "<tbody> <tr style=\"border-bottom: 1px solid #eee;\"> " +
            "<td style=\"padding:15px 0 10px 0;\"> " +
              "<h1>Project Name</h1> " +
                  "<p>" + theProName + "</p>" +
                "</td> " +
                  "</tr><tr style=\"border-bottom: 1px solid #eee;\">" +
                    " <td style=\"padding:15px 0 10px 0;\"> " +
                      "<h1>Client</h1>" +
                         "<p>" + theProCli + "</p>" +
                    "</td></tr> " +
                    "<tr style=\"border-bottom: 1px solid #eee;\">" +
                    "<td style=\"padding:15px 0 10px 0;\">" +
                      "<h1>Description</h1>" +
                        "<p>" + theProDes + "</p> " +
                    "</td></tr> " +
                   " <tr style=\"border-bottom: 1px solid #eee;\"> " +
                    "<td style=\"padding:15px 0 10px 0;\"> " +
                      "<h1>Location</h1> " +
                        "<p>" + theProLoc + "</p> " +
                    "</td></tr> " +
                    "<tr style=\"border-bottom: 1px solid #eee;\">" +
                    "<td style=\"padding:15px 0 10px 0;\">" +
                      "<div class=\"col-xs-4 col-sm-6 no-padding\"> " +
                        "<h1>Rate p/h</h1> " +
                          "<p>£" + theProRate + "</p>" +
                      "</div><div class=\"col-xs-6 col-sm-6 no-padding\">" +
                      "<h1>Total Salary</h1> " +
                        " <p>£" + theProSal + "</p>" +
                      "</div>" +
                    "</td></tr>" +
                    "<tr style=\"border-bottom: 1px solid #eee;\">" +
                    "<td style=\"padding:15px 0 10px 0;\">" +
                      "<h1>Time On Project</h1>" +
                        "<p>" + theProTime + "</p>" +
                    "</td></tr>" +                 
                    "<tr style=\"border-bottom: 1px solid #eee;\">" +
                    "<td style=\"padding:15px 0 10px 0;\">" +
                      "<h1>Date</h1>" +
                        "<p>" + theProDate + "</p></td></tr></tbody></table></div>";

                //insert data into modal
                $('#singleProject .modal-body').html(showPData);
});

//Remove class .projected_selected from table row when anywhere on the document is clicked
$(document).click(function(e) {
  if (!$(e.target).closest('.projects_table tbody tr').length) {
    $('.projects_table tbody tr').removeClass('project_selected');
  }
});
}

// Calculate how many projects the user has
function totalProjects () {
    var tProjects = $(".single_project");
    var noOfProjects = tProjects.length;
    //Display Number Of Total Projects
    $('.project_count').text(noOfProjects + ' Projects');
} // end totalProjects

function getTimeAndSalary () {
//Display combined salary
var sum = 0;
$('.salary').each(function() {
    sum += parseFloat($(this).text());
});
var n = sum.toFixed(2);
$('.salary_count').text('£ ' + n);

//Display combined time
var ct = 0;
$('.totalTime').each(function() {

var hms = $(this).text();
//split the string at each colon (:)
var a = hms.split(':');
//every minute is worth 60 seconds. every hour is worth 60 minutes
var totalSeconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
//Get time in minutes by dividing the total seconds by 60
var totalMinutes = Math.floor(totalSeconds / 60);
//Get time in hours.mins as floating point number by dividing minutes by 60
var totalHours = parseFloat(totalMinutes / 60);
    ct += parseFloat((totalHours).toFixed(2));
});

//Display total hour count  
$('.hours_count').text(ct + ' Hours');

} 

/*

xIndexedDB

------------------------------------ */
window.onload = function() {
//Browser support
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
 
if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

//Add New Project IndexedDB
var request = indexedDB.open("projectsdb", 2);

var db;

var projectsList = document.getElementById('projects_container');

request.onerror = function(event) {
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
    // store the result of opening the database in the db variable.
  db = event.target.result;

    // Log Success in the console
  console.log("IndexedDB Success");

  displayData();  
};

request.onupgradeneeded = function(event){
    console.log("Upgrading");
    
    db = event.target.result;

// Create an objectStore for this database
var objectStore = db.createObjectStore("projects", { keyPath : "project_name" });
    
};

//When Save button is clicked, run saveProject function and projectNotifications function
$("#projSaveBtn").click(function(){
  saveProject();
  recordNotifications();
  stopNotifications();
});

  function saveProject() {

    // All variables needed
    var project_name = $("#project_name").val();
    var client = $("#client").val();
    var description = $("#description").val();
    var location = $("#location").val();
    var hourly_rate = $("#hourly_rate").val(); 

    //Change title to Timer
    $('.time_title').html('Project Timer');

    //Change msg in timer header to the new project name
    $('.t_header_msg').html('<span class="pfont">' + project_name + '</span><br/><br/>Client: ' + client + '<br/><br/>Description: ' + description);

    //hide add project button
    $('.newProjectBtn').addClass('hiddenBtn');

    //show start button and timer
    $('.recordBtn, .t_header_time').removeClass('hiddenBtn');

    //When stop record button is pressed, add the data to projects table
    $(".stopBtn").click(function(e){

        //Get the current date of project
        var today = new Date(); 
        var project_date = today.getDate()+'/'+ (today.getMonth()+1)+'/'+ today.getFullYear();

        //work out salary
        var tTime = $(".t_header_time").val();
        var tSalary = $('#hourly_rate').val();

        //split the string at each colon (:)
        var a = tTime.split(':');
        //every minute is worth 60 seconds. every hour is worth 60 minutes
        var totalSeconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        //Get time in minutes by dividing the total seconds by 60
        var totalMinutes = Math.floor(totalSeconds / 60);
        //Get time in hours.mins as floating point number by dividing minutes by 60
        var totalHours = parseFloat(totalMinutes / 60);
        //get salary by multiplying total hours by salary
        var floatingSal = totalHours * tSalary;
        //get salary to 2 decimals
        var newSalary = floatingSal.toFixed(2);
        //Salary For Project
        //var psal = $('#salary').val(newSalary);

        //Get the recorded time in the timer
        var project_time = $(".t_header_time").val();
        //Get new salary
        var salary = newSalary;

        var transaction = db.transaction(["projects"],"readwrite");

        // On Success
        transaction.oncomplete = function(event) {
            console.log("New Project Added");
            displayData();
        };

        //On Error
        transaction.onerror = function(event) {
            console.log("Sorry, project could not be added");
        };

        var objectStore = transaction.objectStore("projects");

        //Add all data to indexeddb
        objectStore.add({
          project_name: project_name, client: client, description: description, location: location, hourly_rate: hourly_rate, salary: salary, project_time: project_time, project_date:project_date
        });

    });
  }


//Function to display indexeddb data in projects table
function displayData() {
    // Clear contents of project list
    projectsList.innerHTML = "";

    // Open object store and then get a cursor list of all the different data items in the IDB to iterate through
    var objectStore = db.transaction('projects').objectStore('projects');
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
        // if there is still another cursor to go, keep runing this code
        if(cursor) {
            // create a table row
            var tableRow = document.createElement('tr');
            $(tableRow).addClass('single_project');
            $('tableRow').attr('data-toggle','modal');
            $('tableRow').attr('data-target','#singleProject');

            //create table data to put each data item inside when displaying it
            var tableData = 
                "<td class=\"project_id\" style=\"display:none;\"></td>" +
                "<td class=\"project_name\">" + cursor.value.project_name  + "</td>" + 
                "<td class=\"client\" style=\"display:none;\">" + cursor.value.client  + "</td>" + 
                "<td class=\"description\" style=\"display:none;\">" + cursor.value.description  + "</td>" + 
                "<td class=\"location\" style=\"display:none;\">" + cursor.value.location  + "</td>" + 
                "<td class=\"hourlyRate\" style=\"display:none;\"> " + cursor.value.hourly_rate + "</td>" + 
                "<td class=\"salary\" style=\"display:none;\">" + cursor.value.salary + "</td>" +
                "<td class=\"totalTime\" style=\"display:none;\">" + cursor.value.project_time  + "</td>" +
                "<td class=\"pDate\">" + cursor.value.project_date  + "</td>" +
                "<td class=\"tabActions\">" +
                    "<a href=\"#\" class=\"action-edit\"><i class=\"fa fa-eye\" aria-hidden=\"true\"></i></a>" +
                "</td>";
                    
          // put table data inside table row via innerHTML.
          tableRow.innerHTML = tableData;

          // add individual table rows to the table
          projectsList.appendChild(tableRow); 

          // continue on to the next item in the cursor
          cursor.continue();

        }


      }
  

}//end displaydata()


}; // End On Load
//end IndexedDB

/*

xPush Notification Setup

------------------------------------ */
// get permission to run notifications
Notification.requestPermission().then(function(result) {
  console.log(result);
});


// Notification template
function theNotification(theBody, theTitle) {
  var options = {
    body: theBody,
    icon: '../moments/images/icons/icon-256x256.png',
  }

  window.navigator.vibrate(500);

  var n = new Notification(theTitle, options);
  setTimeout(n.close.bind(n), 4000);
}

//Display notifcation when user starts a project and when user ends a project
function recordNotifications() {
  var project_name = $("#project_name").val();
  var client = $("#client").val();

  $(".recordBtn").click(function(){
    var project_name = $("#project_name").val();
    var client = $("#client").val();

    theNotification('You just started a new project called: "' + project_name + '" for "' + client + '"', 'Moments Manager');
  });

}

function stopNotifications() {
  $(".stopBtn").click(function(){
    var project_name = $("#project_name").val();
    var project_time = $(".t_header_time").val();

    theNotification('You just recorded "' + project_time + '" on project: "' + project_name + '"', 'Moments Manager');

    //clear projects form
    document.getElementById("projectsForm").reset();
  });
}