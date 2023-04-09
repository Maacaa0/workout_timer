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
let progressBar = document.getElementById("progress-bar");
const remainingWorkoutTimeDisplay = document.getElementById("remainingWorkoutTime");
const remainingRoundTimeDisplay = document.getElementById("remainingRoundTime");
const remainingRepsDisplay = document.getElementById("remainingReps");
const remainingSetsDisplay = document.getElementById("remainingSets");

let setup = {
    "prep": 10,
    "workout": 30,
    "rest": 15,
    "reps": 5,
    "sets": 3,
}

const phases = {
    "prep": "PREPARE!",
    "workout": "WORKOUT!",
    "rest": "REST",
    "complete": "WORKOUT COMPLETED!"
}


// let remainingRoundTime = 

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
    return `${minutes > 0 ? `${minutes}:${seconds}m`: `${minutes}:${seconds}s`}`
}

function showSetup() {
    
    prep.textContent = secondsToMinutes(setup["prep"]);
    workout.textContent = secondsToMinutes(setup["workout"]);
    rest.textContent = secondsToMinutes(setup["rest"]);
    reps.textContent = setup["reps"];
    sets.textContent = setup["sets"];
    remainingWorkoutTimeDisplay.innerHTML = secondsToMinutes(((setup["workout"] + setup["rest"]) * setup["reps"]) * setup["sets"] + setup["prep"]).slice(0, -1);
    remainingRoundTimeDisplay.innerHTML = secondsToMinutes(setup["prep"]).slice(0, -1);
    remainingRepsDisplay.innerHTML = setup["reps"];
    remainingSetsDisplay.innerHTML = setup["sets"];

}


decrementBtns.forEach(btn => btn.addEventListener('click', function() {
    console.log(setup[btn.name]);
     if ((btn.name === "workout" || btn.name === "rest" || btn.name === "prep") && setup[btn.name] > 5) {
        setup[btn.name] -= 5
    } else if ((btn.name === "reps" || btn.name === "sets") && setup[btn.name] > 1) {
        setup[btn.name] -= 1
    }
    showSetup();
}))

incrementBtns.forEach(btn => btn.addEventListener('click', function() {
    console.log(setup[btn.name]);
    if (btn.name === "prep" || btn.name === "workout" || btn.name === "rest") {
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
        remainingWorkoutTime = ((setup["workout"] + setup["rest"]) * setup["reps"]) * setup["sets"] + setup["prep"];
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
        progressDiv.style.background = `radial-gradient(closest-side, var(--mainBg) 79%, transparent 80% 100%), conic-gradient(#ffc800 ${progressBar.value}%, var(--mainBg) 0)`;
        
        if (timeRemaining <=0) {
            if (currentPhase === "prep") {
                currentPhase = "workout";
                timeRemaining = setup.workout;
            } else if (currentPhase === "workout") {
                currentPhase = "rest";
                timeRemaining = setup.rest;
            } else if (currentPhase === "rest") {
                currentPhase = "workout";
                timeRemaining = setup.workout;
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
                            window.location.reload();
                        },5000)
                    }
                }
            }
        }
        phaseDisplay.innerHTML = phases[currentPhase];
        remainingWorkoutTimeDisplay.innerHTML = secondsToMinutes(remainingWorkoutTime).slice(0, -1);
        remainingRoundTimeDisplay.innerHTML = secondsToMinutes(timeRemaining).slice(0, -1);
        remainingRepsDisplay.innerHTML = repsRemaining;
        remainingSetsDisplay.innerHTML = setsRemaining;

        
        
    }, 1000)
    
}

// Define pause and resume functions
let timerState;

function pauseTimer() {
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


startWorkout.addEventListener('click', function() {
    if (startedWorkout === "started" || startWorkout === "finished") {
        return
    } else if (startedWorkout === "paused") {
        resumeTimer()
    } else {
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
})