let playBtn = document.querySelector("#pause");
let resetBtn = document.querySelector("#reset");
const bell = document.querySelector("#bell-ring");
const audioTag = document.querySelector("#audioTag");
const time = [...document.querySelectorAll(".time")];
const clearBtn = document.querySelector("#clear");
const settingsBtn = document.querySelector("#settings");


const hoursEl = document.querySelector(".hours");
const minsEl = document.querySelector(".mins");
const secsEl = document.querySelector(".secs");

let semiCircles = [...document.querySelectorAll(".r1")];

let pauseIcon = `<i class="fa fa-pause" aria-hidden="true"></i>`;
let playIcon = `<i class="fa fa-play" aria-hidden="true"></i>`;


const form = document.querySelector("#form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
})

let hr;
let min;
let sec;

const removeBtn = document.querySelector(".remove")

removeBtn.addEventListener("click", () => {
    form.classList.remove("openSettings");
})

const hourRange = document.querySelector("#hourRange");
let v1 = document.querySelector("#v1");

hourRange.addEventListener("change", () => {
    console.log(hourRange.value);
    v1.innerText = hourRange.value;
})

const minRange = document.querySelector("#minRange");
let v2 = document.querySelector("#v2");

minRange.addEventListener("change", () => {
    v2.innerText = minRange.value;
});

const secRange = document.querySelector("#secRange");
let v3 = document.querySelector("#v3");

secRange.addEventListener("change", () => {
    v3.innerText = secRange.value;
})

const addTime = document.querySelector("#add");

addTime.addEventListener("click", () => {
    if(v1.innerText == ".." && v2.innerText == ".." && v3.innerText == ".."){
        return;
    }else{
        form.classList.remove("openSettings");
        hr = parseFloat(v1.innerText);
        min = parseFloat(v2.innerText);
        sec = parseFloat(v3.innerText);

        enableBtns()
    }

    setTimer();
})

settingsBtn.addEventListener("click", () => {

    if(form.classList.contains("openSettings")){
        return;
    }else{
        form.classList.add("openSettings")
    }
})


let hours;
let minutes;
let seconds;

let startTime;
let setTime;
let futureTime;

function setTimer(){

    hours = hr * 3600000;
    minutes = min * 60000;
    seconds = sec * 1000;
    startTime = Date.now();
    setTime = hours + minutes + seconds;
    futureTime = setTime + startTime;

}


/* settings for the play and pause btns */
let timer;
let remainingTime;
let newAngle = 0;
let angle;
let degree = 360;

/* settings for the reset button */
let green = `rgb(88, 236, 88)`;
let red = `red`;


let audioPlay;
let timeOut;

function startTimer() {
    let currTime = Date.now();
    remainingTime = Math.ceil(futureTime - currTime);
    angle = (remainingTime / setTime) * degree;

    if(remainingTime <= 5000){
        semiCircles[1].style.backgroundColor = `red`;
        semiCircles[0].style.backgroundColor = `red`;
        changeColor(red);
    }

    if(angle > 180){
        semiCircles[2].style.display = 'none';
        semiCircles[1].style.transform = `rotate(${angle}deg)`;
        semiCircles[1].style.transition = `transform 0.99s linear`
        semiCircles[0].style.transform = `rotate(180deg)`
        semiCircles[0].style.transition = `transform 0.99s linear`
    }else{
        semiCircles[2].style.display = 'block';
        semiCircles[1].style.transform = `rotate(${angle}deg)`;
        semiCircles[0].style.transform = `rotate(${angle}deg)`;
        semiCircles[1].style.transition = `transform 0.99s linear`
        semiCircles[0].style.transition = `transform 0.99s linear`
    }

    if(remainingTime <= 0){
        ringBell(remainingTime);
    }

    let hour = Math.floor(remainingTime / 1000 / 60 / 60) % 24;
    let min = Math.floor(remainingTime / 1000 / 60) % 60;
    let sec = Math.ceil(remainingTime / 1000) % 60; 

    hoursEl.innerText = hour;
    minsEl.innerText = min;
    secsEl.innerText = sec;

    if(angle <= 0){
        semiCircles[2].style.display = 'none';
        semiCircles[1].style.display= `none`;
        semiCircles[0].style.display = `none`;
        hoursEl.innerText = `00`;
        minsEl.innerText = `00`;
        secsEl.innerText = `00`;
        clearInterval(timer);
        settingsBtn.disabled = false;
    }
}


let pausedTime = 0;

playBtn.addEventListener("click", () => {

    settingsBtn.disabled = true;

    if(playBtn.classList.contains("play")){

        semiCircles[2].style.display = 'none';
        semiCircles[1].style.display= `block`;
        semiCircles[0].style.display = `block`;

        semiCircles[1].style.backgroundColor = `rgb(88, 236, 88)`;
        semiCircles[0].style.backgroundColor = `rgb(88, 236, 88)`;

        setTime = pausedTime == 0 ? hours + minutes + seconds : pausedTime;
        degree = newAngle == 0 ? degree : newAngle;
        console.log(pausedTime)
        startTime = Date.now();
        futureTime = setTime + startTime;

        startTimer();
        timer = setInterval(startTimer, 1000);
        playBtn.innerHTML = pauseIcon;
        playBtn.classList.add("pause");
        playBtn.classList.remove("play");
    }else{
        clearInterval(timer);
        console.log(remainingTime, angle);
        newAngle = angle;
        pausedTime = remainingTime;
        console.log(pausedTime)
        playBtn.innerHTML = playIcon;
        playBtn.classList.remove("pause");
        playBtn.classList.add("play");
    }
})

resetBtn.addEventListener("click", () => {
    if(playBtn.classList.contains("pause")){
        clearInterval(timer);

        degree = 360;
        startTime = Date.now();
        setTimer()
        startTimer();
        timer = setInterval(startTimer, 1000);
        playBtn.innerHTML = pauseIcon;
        playBtn.classList.add("pause");
        playBtn.classList.remove("play");
        console.log("clicked");

        semiCircles[2].style.display = 'none';
        semiCircles[1].style.display= `block`;
        semiCircles[0].style.display = `block`;

        semiCircles[1].style.backgroundColor = `rgb(88, 236, 88)`;
        semiCircles[0].style.backgroundColor = `rgb(88, 236, 88)`;

        audioTag.pause();
        audioTag.currentTime = 0;

        bell.style.animation = "none";
        bell.style.color = green;
        clearInterval(audioPlay);
        changeColor(green)
    }else{
        return;
    }
    
})

function ringBell(){
    bell.style.animation = `ring 0.1s linear infinite`
    audioTag.src = `/audio/Alarm-Clock.mp3`;
    playAudio();
    audioPlay = setInterval(playAudio, 4000);
}

function playAudio(){
    audioTag.play();
}

timeOut = setTimeout( () => {
    clearInterval(audioPlay);
}, 90000);


function clearTimeOut(){
    clearTimeout(timeOut);
    console.log("cleared")
}

function changeColor(color){
    time.forEach( (item) => {
        item.style.color = `${color}`
    })
}


clearBtn.addEventListener("click", () => {
    pausedTime = 0;
    newAngle = 0;
    degree = 360;
    clearInterval(timer);
    semiCircles[2].style.display = 'none';
    semiCircles[1].style.display= `none`;
    semiCircles[0].style.display = `none`;
    playBtn.classList.remove("pause");
    playBtn.classList.add("play");
    playBtn.innerHTML = playIcon;
    clearInterval(audioPlay);
    audioTag.pause();
    audioTag.currentTime = 0;
    changeColor(green);
    clearTimeOut();
    bell.style.animation = "none";
    bell.style.color = green;

    hoursEl.innerText = `00`;
    minsEl.innerText = `00`;
    secsEl.innerText = `00`;
})


window.onload = () => {
    disableBtns();
}

function disableBtns() {
    playBtn.disabled = true;
    resetBtn.disabled = true;
}

function enableBtns() {
    playBtn.disabled = false;
    resetBtn.disabled = false;
}