function init() {
    addListener("class", ".plus", add);
    addListener("class", ".minus", subtract);
    addListener("class", ".reset", reset);
    addListener("id", "play_pause", toggleStart);
    updateClock("25");
}

function addListener(prop, selector, func) {
    if (prop === "class") {
        var sels = document.querySelectorAll(selector);
        for (var i = 0; i < sels.length; i++) {
            sels[i].addEventListener("click", func);
        }
    }
    if (prop === "id") {
        el = document.getElementById(selector);
        el.addEventListener("click", func);
    }
    
}

function add(e) {
    var el = e.target;   
    var int = el.nextElementSibling.textContent;
    if (int < 60) {
        int++;
        el.nextElementSibling.textContent = int;
        updateClock(int);
    }        
}

function subtract(e) {
    var el = e.target;   
    var int = el.previousElementSibling.textContent;
    if (int > 1) {
        int--;
    el.previousElementSibling.textContent = int;
    updateClock(int);
    } 
}

function updateClock(val) {    
    var el = document.getElementById("time");
    el.textContent = val + ":00";    
}

function reset() {
    var elm = document.getElementById("workTime");
    var message = document.getElementById("message");
    elm.textContent = '25';
    elm = document.getElementById("breakTime");
    elm.textContent = '5';
    elm = document.getElementById("time");
    elm.textContent = "25:00";
    clearInterval(intervalId);
    state = 0;
    message.textContent = "";
}

var isRunning = false;
var isSession = true;
var intervalId;
var state = 0; // initial

function play(isSession) {
    state = 1;
     var minute, second, display, message;
     message = document.getElementById("message");
  //   if (state === 0) {    
    if (isSession) {  //clock.state === session
        display = document.getElementById("workTime");  
        message.textContent = "All Work and no play";      
    } else {
        display = document.getElementById("breakTime");
        message.textContent = "Gimme a break!";
    }
    minute = display.textContent;
    //minute = 1;
    minute--;
    second = "59"; 
    start(isSession, minute, second);  
  //  } 
  //  if (state > 1) {
  //  }
}

function start(isSession, minute, second) {
    clearInterval(intervalId);   
    var el = document.getElementById("time");  
    intervalId = setInterval(function() {
        console.log(minute + ", " + second);
        second < 10 && second >= 0 ? second = "0"+ second : second = second;
        minute < 10 && minute.toString().length === 1 ? minute = "0"+ minute : minute = minute;           
        el.textContent = minute + ":" + second;
        if (minute === '00' && second === '00') { 
            if (isSession) {
                isSession = false; 
                play(isSession);                  
            } 
            else {
                isSession = true;
                play(isSession);
            }
        }
        if (second === '00') {
            minute--;                
            second = parseInt(second) + 60;
        }
        second--;             
    }, 1000);
}

function resume() {

}

function pause() {
           clearInterval(intervalId);
        }

function toggleStart(e) {
    var control = document.getElementById("play_pause");
    if (!isRunning) {        
        control.setAttribute("class", "fa fa-pause"); // show pause icon
        // changing session or break length is not possible        
        // start or resume timer
        if (state === 0) {
            play(isSession); 
        }   
        if (state === 1) {
            resume();
        }         
        isRunning = true;        
    } else {              
        control.setAttribute("class", "fa fa-play"); // show play icon 
        // changing session or break length is possible
        pause();  // pause timer
        isRunning = false;  
    }
    // depending on state, run function:

    // if clock is not running:     
    // if clock is in play state
    // if clock is in pause state
}



// clock has state session or break, do i also need a neutral state? 

// gets time from controls display
function getTime() {
    var minute, second, display;
    if (isSession) {  //clock.state === session
        display = document.getElementById("workTime");        
    } else {
        display = document.getElementById("breakTime");
    }
    minute = display.textContent;
    second = "00";

}
// shows time running on clock
function run(minute, second) {
    var minute = minute;
    var second = second;
    var el = document.getElementById("time");
  
    var intervalId = setInterval(function() {
        console.log("is running!");
        el.textContent = minute + ":" + second;
        if (minute === 0 && second === 0) {return;}
        if (minute !== 0 && second === 0) {
            minute--;
            second === 60;
        }
        // decrease seconds and /or minutes 
        second--;
        
    }, 1000);

}

init();
