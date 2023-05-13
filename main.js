const prep = document.getElementById("prep");
const workout = document.getElementById("workout");
const rest = document.getElementById("rest");
const reps = document.getElementById("reps");
const sets = document.getElementById("sets");

const remainingTime = document.getElementById("remaining");

const timerMenu = document.getElementById("main");
const counter = document.getElementById("counter");

const decrementBtns = document.querySelectorAll(".decrement");
const incrementBtns = document.querySelectorAll(".increment");
const proceedBtn = document.getElementById("start");
const progressBar = document.getElementById("progress-bar");
const remainingWorkoutTimeDisplay = document.getElementById("remainingWorkoutTime");
const remainingRoundTimeDisplay = document.getElementById("remainingRoundTime");
const remainingRepsDisplay = document.getElementById("remainingReps");
const remainingSetsDisplay = document.getElementById("remainingSets");

const toggleSettings = document.getElementById("toggleSettings");
const settingsCard = document.getElementById("settings");
const chevronUp = document.getElementById("chevronUp");
const toggleSoundBtn = document.getElementById("soundsToggle");
const soundIcon = document.getElementById("soundIcon");
const paused = document.getElementById("paused");

toggleSettings.addEventListener("click", ()=> {
    settingsCard.classList.toggle("shown");
    settingsCard.classList.contains("shown") ? chevronUp.classList = "fa-solid fa-chevron-down" : chevronUp.classList = "fa-solid fa-chevron-up";
});

let toggleSound = true;
toggleSoundBtn.addEventListener("click", ()=> {
    toggleSound ? toggleSound = false : toggleSound = true;
    toggleSound ? soundIcon.classList = "fa-solid fa-volume-high" : soundIcon.classList = "fa-solid fa-volume-xmark"
})

let setup = {
    "prep": 10,
    "workout": 30,
    "rest": 15,
    "reps": 5,
    "sets": 3,
    "recovery": 5
}

const phases = {
    "prep": "PREPARE!",
    "workout": "WORKOUT!",
    "recovery": "RECOVER",
    "rest": "REST",
    "complete": "WORKOUT COMPLETED!"
}


showSetup()

function secondsToMinutes(type) {
    let minutes = Math.floor(type / 60);
    let seconds = type - minutes * 60;

    if (minutes < 10) {
        minutes = minutes.toString().padStart(2,'0');
    }

    if (seconds < 10) {
        seconds = seconds.toString().padStart(2,'0');
    }
    return `${minutes > 0 ? `${minutes}:${seconds}`: `${minutes}:${seconds}`}`
}

function calcTime() {
    let workCalc = (setup.workout * setup.reps) * setup.sets;
    let restCalc = (setup.rest * setup.reps) * setup.sets - setup.rest * setup.sets;
    let recoveryCalc = setup.recovery * setup.sets - setup.recovery;
    return workCalc + restCalc + recoveryCalc + setup.prep;
}

function showSetup() {
    
    prep.textContent = secondsToMinutes(setup["prep"]);
    workout.textContent = secondsToMinutes(setup["workout"]);
    rest.textContent = secondsToMinutes(setup["rest"]);
    reps.textContent = setup["reps"];
    sets.textContent = setup["sets"];
    recovery.textContent = secondsToMinutes(setup["recovery"]);
    remainingWorkoutTimeDisplay.innerHTML = secondsToMinutes(calcTime());
    remainingRoundTimeDisplay.innerHTML = secondsToMinutes(setup["prep"]);
    remainingRepsDisplay.innerHTML = setup["reps"];
    remainingSetsDisplay.innerHTML = setup["sets"];

}


decrementBtns.forEach(btn => btn.addEventListener('click', function() {
     if ((btn.name === "workout" || btn.name === "rest" || btn.name === "prep" || btn.name === "recovery" ) && setup[btn.name] > 5) {
        setup[btn.name] -= 5
    } else if ((btn.name === "reps" || btn.name === "sets") && setup[btn.name] > 1) {
        setup[btn.name] -= 1
    }
    showSetup();
}))

incrementBtns.forEach(btn => btn.addEventListener('click', function() {
    if (btn.name === "prep" || btn.name === "workout" || btn.name === "rest" || btn.name === "recovery") {
        setup[btn.name] += 5
    } else if ((btn.name === "reps" || btn.name === "sets")) {
        setup[btn.name] += 1
    }
    showSetup();
}))

let timer;
let currentPhase = "prep";
let timeRemaining; 
let repsRemaining;
let setsRemaining;
let remainingWorkoutTime;
let startedWorkout = "stopped";

function setValues() {
    if (startedWorkout === "paused") {
        return 
    } else {
        repsRemaining = setup.reps;
        setsRemaining = setup.sets;
        timeRemaining = setup.prep;
        remainingWorkoutTime = calcTime()
    }
}

const completeSound = new Audio("audio/workout-complete.mp3");
const workoutSound = new Audio("audio/workout.mp3");
const restSound = new Audio("audio/rest.mp3");
let beepSound = new Audio('audio/Beep-1.mp3');
let startBeepSound = new Audio('audio/Beep-3.mp3');


let workoutPlay = true;
let restPlay = true;
function playSound() {
    if (toggleSound) {
        if (Math.floor(timeRemaining) > 0 && Math.floor(timeRemaining) < 4) {
            beepSound.play()
        } else if (Math.floor(timeRemaining) === 0) {
            startBeepSound.play();
        }
        
        if (currentPhase === "workout") {
            if (workoutPlay === true) {
                workoutSound.play();
            }
            workoutPlay = false;
            restPlay = true;
        } else if (currentPhase === "rest" || currentPhase === "recovery") {
            if (restPlay === true) {
                restSound.play();
            }
            restPlay = false;
            workoutPlay = true;
         }
        
    }
    
}

function startTimer() {
    setValues();
    startedWorkout = "started";
     
    const phaseDisplay = document.getElementById("phase");
    const progressDiv = document.querySelector(".progress-bar");
    
    

    timer = setInterval(function() {
        timeRemaining--;
        remainingWorkoutTime--;
        progressBar.value = 100-timeRemaining/setup[currentPhase]*100;
        progressDiv.style.background = `radial-gradient(closest-side, var(--textDarker) 95%, transparent 80% 100%),
        conic-gradient(var(--iconDarker) ${progressBar.value}%, var(--compBg) 0)`;
        playSound();
        if (timeRemaining <= 0) {
            if (currentPhase === "prep") {
                currentPhase = "workout";
                timeRemaining = setup.workout;
            } else if (currentPhase === "rest") {
                currentPhase = "workout";
                timeRemaining = setup.workout;
            } else if (currentPhase === "workout") {
                currentPhase = "rest";
                timeRemaining = setup.rest;
                repsRemaining--;
                if (repsRemaining === 0) {
                    repsRemaining = setup.reps;
                    setsRemaining--;
                    if (setsRemaining === 0) {
                        clearInterval(timer);
                        currentPhase = "complete";
                        remainingWorkoutTime = 0;
                        repsRemaining = 0;
                        timeRemaining = 0;
                        startedWorkout = "finished";
                        startBtn.disabled = true;
                        pauseBtn.disabled = true;
                        setTimeout(function() {
                            if (toggleSound) {
                                completeSound.play()
                            }
                        }, 2000);
                        
                        setTimeout(function() {
                            window.location.reload();
                        },5000)
                    } else {
                        // start the recovery phase
                        currentPhase = "recovery";
                        timeRemaining = setup.recovery;
                    }
                }
            } else if (currentPhase === "recovery") {
                // start the next round
                currentPhase = "workout";
                timeRemaining = setup.workout;
            }
        }
        phaseDisplay.innerHTML = phases[currentPhase];
        remainingWorkoutTimeDisplay.innerHTML = secondsToMinutes(remainingWorkoutTime);
        remainingRoundTimeDisplay.innerHTML = secondsToMinutes(timeRemaining);
        remainingRepsDisplay.innerHTML = repsRemaining;
        remainingSetsDisplay.innerHTML = setsRemaining;

        
        
    }, 1000)
    
}

// Define pause and resume functions
let timerState;

function pauseTimer() {
    paused.style.display = "block";
    if (startedWorkout === "stopped") {
        return
    } else {
        clearInterval(timer);
        startedWorkout = "paused";
        timerState = {
            currentPhase,
            timeRemaining,
            repsRemaining,
            setsRemaining,
            timer
    }
    }    
}

function resumeTimer() {
    if (startedWorkout === "finished") {
        return
    } else {
        currentPhase = timerState.currentPhase;
        timeRemaining = timerState.timeRemaining;
        repetitionsRemaining = timerState.repetitionsRemaining;
        setsRemaining = timerState.setsRemaining;
        timer = timerState.timer;
        startTimer();
    }
}

proceedBtn.addEventListener('click', function() {
    timerMenu.style.display = "none";
    counter.style.display = "block";


})


const startWorkout = document.getElementById("startBtn");
const pauseWorkout = document.getElementById("pauseBtn");
const settingsBtn = document.getElementById("settingsBtn");


// function to make sound on mobile work (This way all sounds are "played" with a touch event and loaded into memory.)
function proceed() {
    // workoutSound.volume = 0;
    // restSound.volume = 0;
    // beepSound.volume = 0;
    // startBeepSound.volume = 0;

    workoutSound.play();
    workoutSound.pause();
    restSound.play();
    restSound.pause();
    beepSound.play();
    beepSound.pause();
    startBeepSound.play();
    startBeepSound.pause();
    completeSound.play();
    completeSound.pause();
    // sound3.play();
    // sound3.pause();

    // workoutSound.volume = 1;
    // restSound.volume = 1;
    // beepSound.volume = 1;
    // startBeepSound.volume = 1;

}


startWorkout.addEventListener('click', function() {
    paused.style.display = "none";
    if (startedWorkout === "started" || startedWorkout === "finished") {
        return
    } else if (startedWorkout === "paused") {
        resumeTimer()
    } else {
        proceed();
        startTimer()
    }
})

pauseWorkout.addEventListener('click', pauseTimer);

settingsBtn.addEventListener('click', function() {
    // timerMenu.style.display = "block";
    // counter.style.display = "none";
    // clearInterval(timer);
    // startedWorkout = "stopped";
    // setup = {
    //     "prep": 10,
    //     "workout": 30,
    //     "rest": 15,
    //     "reps": 5,
    //     "sets": 3,
    //}
    window.location.reload();
});


// need to improve responsiveness (design overall);