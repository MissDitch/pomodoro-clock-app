function init() {
    addListener(".plus", add);
    addListener(".minus", subtract);
    addListener(".reset", reset);
}

function addListener(selector, func) {
    var sels = document.querySelectorAll(selector);
    for (var i = 0; i < sels.length; i++) {
        sels[i].addEventListener("click", func);
    }
}

function add(e) {
    if (e.target !== this) { //http://stackoverflow.com/questions/9183381/how-to-have-click-event-only-fire-on-parent-div-not-children
        var el = e.target.parentElement;   
        var int = el.nextElementSibling.textContent;
        if (int < 60) {
            int++;
            el.nextElementSibling.textContent = int;
            updateClock(int);
        }        
    } else return;
}

function subtract(e) {
    if (e.target !== this)  {
       var el = e.target.parentElement;   
        var int = el.previousElementSibling.textContent;
        if (int > 1) {
            int--;
        el.previousElementSibling.textContent = int;
        updateClock(int);
        }        
    } else return;
}

function updateClock(val) {    
    var el = document.getElementById("time");
    el.textContent = val + ":00";    
}

function reset() {
    var elm = document.getElementById("workTime");
    elm.textContent = '25';
    elm = document.getElementById("breakTime");
    elm.textContent = '5';
    elm = document.getElementById("time");
    elm.textContent = "25:00";
}

init();
