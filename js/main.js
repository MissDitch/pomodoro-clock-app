function init() {
    addListener("class", ".plus", add);
    addListener("class", ".minus", subtract);
    addListener("class", ".reset", reset);
    addListener("id", "play_pause", toggleStart);
    updateClock("25");
}

var pomodoro, state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed
var isRunning = false;
var isSession = true;
var intervalId;

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
    if (val.toString().length === 1) { val = "0" + val; }
    //else val = val;
    var time= document.getElementById("time");
    time.textContent = val + ":00";    
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

function toggleStart(e) {
    var control = document.getElementById("play_pause");
    if (!isRunning) {        
        control.setAttribute("class", "fa fa-pause"); 
        // changing session or break length is not possible        
        // start or resume timer
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
        // changing session or break length is possible?
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
    var display, message, time, minute, second;
    if (arguments.length > 2) {
        minute = minute;
        second = second;
    }
    message = document.getElementById("message");
    time = document.getElementById("time");
  
    if (state === 0) {    
        state = 1;
        if (isSession) {  
            display = document.getElementById("workTime");  
            message.textContent = "All Work and no play";
            document.getElementsByTagName("html")[0].style.background = "#ec407a";  //Pink 400
            document.getElementById("circle-inner").style.background = "#F44336"; //  Red 500
            document.getElementById("circle-outer").style.background = "#fce4ec";  // Pink 50     
        } else {
            display = document.getElementById("breakTime");
            message.textContent = "Gimme a break!"; 
            document.getElementsByTagName("html")[0].style.background = "#00BCD4";  //cyan 500  
            document.getElementsByTagName("html")[0].style.background = "#009688"; //teal 500
            // document.getElementById("circle").style.background = "#4CAF50"; //green 500 
            document.getElementById("circle-inner").style.background = "#00BCD4";  //cyan 500
            document.getElementById("circle-outer").style.background = "#e0f7fa";  //cyan 50 
            //circle__outer #e0f7fa   //cyan 50    
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
    var time = document.getElementById("time");  
    intervalId = setInterval(function() {
        console.log(minute + ", " + second);
        second < 10 && second >= 0 ? second = "0"+ second : second = second;
        minute < 10 && minute.toString().length === 1 ? minute = "0"+ minute : minute = minute;           
        time.textContent = minute + ":" + second;
        document.title = time.textContent;
        if (minute === '00' && second === '00') { 
           
            if (isSession) {
                makeSound(261.1);
                isSession = false; 
                run(isSession, 0);                  
            } 
            else { 
                makeSound(523.3);               
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

function makeSound(frequency) {   
    //var audioCtx = new AudioContext();
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    //var frequency = 261.6;
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
