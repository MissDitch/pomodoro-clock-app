function init() {
    addListener("class", ".plus", customizeLength);
    addListener("class", ".minus", customizeLength);
    addListener("class", ".reset", reset);
    addListener("id", "play_pause", toggleStart);
    updateClock("25");
    setFinishLines();
}

var pomodoro, state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed
var isRunning = false;
var isSession = true;
var intervalId, audioCtx;

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

function setFinishLines () {     // set finishlines of session and break on circle
    var finSession, finBreak, sessionDeg, breakDeg;
    finSession = document.getElementById("finish-session");
    finBreak = document.getElementById("finish-break"); 
    sessionDeg = (90 + (document.getElementById("workTime").textContent * 6) );
    breakDeg = sessionDeg + (document.getElementById("breakTime").textContent * 6);
    finSession.style.transform = "rotate(" + sessionDeg + "deg)";
    finBreak.style.transform = "rotate(" + breakDeg + "deg)";  
}

function customizeLength(e) {    
    if (!isRunning && state === 0) {
        var el = e.target, int;  
        if (el.textContent === "+" ) {
            int = el.nextElementSibling.textContent;
            if (int < 60) {
             int++;
             el.nextElementSibling.textContent = int;
            }
        }  
        if (el.textContent === "-") {
            int = el.previousElementSibling.textContent;
            if (int > 1) {
                int--;
                el.previousElementSibling.textContent = int;
            }         
        }         
        setFinishLines();

        if (el.parentNode.parentNode.getAttribute("class") === 'controls__work' ) {
            updateClock(int)}
    }
}

function updateClock(val) {     
    if (val.toString().length === 1) { val = "0" + val; } 
    document.getElementById("time").textContent = val + ":00"; 
}

function reset() {
    var elm = document.getElementById("workTime");
    elm.textContent = '25';
    elm = document.getElementById("breakTime");
    elm.textContent = '5';
    elm = document.getElementById("time");
    elm.textContent = "25:00";
    clearInterval(intervalId);
    state = 0;
    isRunning = false;
    isSession = true;
    elm = document.getElementById("message");
    message.textContent = "";
}

function toggleStart(e) {
    var control = document.getElementById("play_pause");
    if (!isRunning) {        
        control.setAttribute("class", "fa fa-pause");            
        if (state === 0) {
            pomodoro = new Pomodoro(); 
            state = 1;
            pomodoro.start();
        }  
        if (state === 2) {
            state = 3;
            pomodoro.resume();
        }                
        isRunning = true;        
    } else {              
        control.setAttribute("class", "fa fa-play"); 
        if (state === 1 || state === 3) {
            pomodoro.pause();
        }  
        isRunning = false;  
    }
}

function Pomodoro() { 
    var minute, second, intervalId, startTime, remaining = 0;
    var timeString, time = document.getElementById("time");

    this.start = function() {
        run(isSession, 0, minute, second);
    };
    this.pause = function () {        
        timeString = time.textContent;
        minute = timeString.slice(0,2);
        second = timeString.slice(3);
        state = 2;
        pause();        
    };
    this.resume = function () {
        second--;
        run(isSession, 2, minute, second);
    };    
}

function run(isSession, state, minute, second) {
    var display, message, time, finSession, finBreak, sessionDeg, breakDeg;
    if (arguments.length > 2) { // resume countdown
        minute = minute;
        second = second;
    }  
    message = document.getElementById("message");
    time = document.getElementById("time");
  
    if (state === 0) {    
        state = 1;
        if (isSession) {  
            display = document.getElementById("workTime");  
            message.textContent = "In session";
            document.getElementsByTagName("html")[0].style.background = "#ec407a";  //Pink 400
            document.getElementById("circle-inner").style.background = "#F44336"; //  Red 500
            document.getElementById("circle-outer").style.background = "#fce4ec";  // Pink 50     
        } else {
            display = document.getElementById("breakTime");
            message.textContent = "Have a break!"; 
            document.getElementsByTagName("html")[0].style.background = "#009688"; //teal 500
            document.getElementById("circle-inner").style.background = "#00BCD4";  //cyan 500
            document.getElementById("circle-outer").style.background = "#e0f7fa";  //cyan 50 
        }

        minute = display.textContent;
        minute--;
        second = "59";  
        countDown(isSession, minute, second);            
    } 
    if (state === 2) {
        state = 3; 
        countDown(isSession, minute, second);        
    }      
}

function countDown (isSession, minute, second) {
    clearInterval(intervalId);   
    var audio, time = document.getElementById("time");  
    intervalId = setInterval(function() {
        second < 10 && second >= 0 ? second = "0"+ second : second = second;
        minute < 10 && minute.toString().length === 1 ? minute = "0"+ minute : minute = minute;           
        time.textContent = minute + ":" + second;
        document.title = time.textContent;
        fillCircle(isSession, minute, second);        
        
        if (minute === '00' && second === '00') {            
            if (isSession) {
                makeSound(261.1);  
                isSession = false; 
                run(isSession, 0);                  
            } 
            else { 
                makeSound(523.3);  
                setNextPomodoro();
                isSession = true;
                run(isSession, 0);
            }
        }
        if (second === '00') {        
            minute--;                
            second = parseInt(second) + 60;
        }
        second--;             
    }, 1000);
}

function pause() {
   clearInterval(intervalId);
}

function setNextPomodoro() {
    var mask = document.getElementById("mask");
    mask.style.opacity = "1";
    mask.style.transform = "rotate(0deg)";
    document.getElementById("right-half").style.opacity = "0";
    document.getElementById("left-half").style.transform = "rotate(0deg)";
    clearInterval(intervalId);
    state = 0;
    isRunning = false;
    isSession = true;
}

function fillCircle(isSession, minute, second) {
    var display, length, left, right, mask, numSec, numDeg, sessionDeg, breakDeg;
    numSec = parseInt(minute) * 60 + parseInt(second);    
    left = document.getElementById("left-half");   
    right = document.getElementById("right-half");
    mask = document.getElementById("mask");
    sessionDeg = document.getElementById("workTime").textContent * 6 ;
    breakDeg = sessionDeg + document.getElementById("breakTime").textContent * 6;

    isSession? display = document.getElementById("workTime") : display = document.getElementById("breakTime"); 
    length = display.textContent; 
   
    [].forEach.call(document.getElementsByClassName("whole"), (function(element) {
        isSession ? element.style.background = "#FF77A9": element.style.background = "#62EFFF";
    }));
   
    if (isSession) { numDeg =  sessionDeg - (numSec * 0.1); }
    else { 
        numDeg = (sessionDeg + breakDeg) - (sessionDeg + numSec * 0.1); 
        mask.style.transform = "rotate(" + sessionDeg + "deg)";
    }
    
    if (numDeg > 180 ) {
        if (isSession) {
            right.style.opacity = "1"; 
            mask.style.opacity = "0";       
        } else {
            right.style.opacity = "0";
            mask.style.opacity = "1";
        }        
    }    
    left.style.transform = "rotate(" + numDeg + "deg)";
}

function makeSound(frequency) {  
    if (audioCtx) { audioCtx.close(); }
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    var x = setTimeout(function() {
        gainNode.gain.exponentialRampToValueAtTime (0.00001, audioCtx.currentTime + 5);
    }, 2000);  
}

init();
