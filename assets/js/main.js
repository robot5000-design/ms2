// Scrolls to top on page load
$(document).ready(function() {
    window.scroll(0, 0);
});

// Declare Classes  ######################################################################
/**
 * @class - Represents all page sound effects courtesy w3schools
 * @param { string } src - path to sound file
 */
class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.volume = 0;
        document.body.appendChild(this.sound);
        /** @function  - plays a sound file */
        this.play = function () {
            this.sound.play();
        };
        this.stop = function () {
            this.sound.pause();
        };
    }
}

// Declare variables  ######################################################################

// category of questions selected
let category = "18";
// quantity of questions selected
let amount = "5";
// difficulty level of questions selected
let difficulty = "easy";
// token to access API
let token = "";
// correct answer to current question
let correctAnswer = "";
// number of correct answers current quiz
let score = 0;
// array index number of current question
let questionIndex = 0;
// current set of questions & answers
let setOfQuestions = {};
// highest score achieved by user in each category represented as an object
let highScore = 0;
// the id of the setInterval timer function
let countdown = 0;
// question timer length in seconds
let questionTimer = 20;
// number of seconds remaining on the timer
let secondsLeft = 0;
// new instance of the sound class representing a correct answer
let correctAnswerSound = new Sound("assets/sounds/correct-answer.mp3");
// new instance of the sound class representing a wrong answer
let wrongAnswerSound = new Sound("assets/sounds/wrong-answer.mp3");
// new instance of the sound class representing a button press
let buttonPress = new Sound("assets/sounds/button-press.mp3");
// new instance of the sound class representing a new high score
let highScoreSound = new Sound("assets/sounds/new-high-score.mp3");
// new instance of the sound class representing a well done score
let wellDoneSound = new Sound("assets/sounds/well-done.mp3");
// new instance of the sound class representing a sad score
let sadSound = new Sound("assets/sounds/sad-sound.mp3");
// contains all answer buttons
let answerButtons = $(".question-answers").children("button");
// opentdb API url address to obtain token
let tokenUrl = "https://opentdb.com/api_token.php?command=request";
// contains buttons representing quiz category options
let categoryButtons = $(".categories").children("button");
// contains buttons representing quiz difficulty options
let difficultyButtons = $(".difficulty-level").children("button");
// contains buttons representing quiz quantity of questions options
let quantityButtons = $(".question-quantity").children("button");
// translates the category from numerical identifier to text
let categoryString = "";



// Check and retrieve Local and Session Storage Values  ######################################################################
/**
 * Checks local storage for a high score object
 */
if (localStorage.getItem("highScore")) {
    console.log("highscore exists");    
    highScore = JSON.parse(localStorage.getItem("highScore"));
    $(".computing-score").html(`${highScore["computing"]}`);
    $(".maths-score").html(`${highScore["mathematics"]}`);
    $(".general-science-score").html(`${highScore["general"]}`);
} else {
    highScore = {
    computing: 0,
    mathematics: 0,
    general: 0 
    };
}
console.log(highScore);

/**
 * Checks session storage if a token already exists
 */
if (sessionStorage.getItem("sessionToken")) {
    token = sessionStorage.getItem("sessionToken");
    console.log("sessionToken", token);
}

// Normal Functions  ######################################################################
/**
 * Switches between quiz options OR quiz questions/answers
 */
function toggleOptions() {
    // show quiz questions and answers
    if ($(".quiz-options").css("display") != "none") {
        // timeout to allow countdown timer to start
        setTimeout(function() {
            $(".answer").removeClass("disable");
        }, 1200);
        $(".quiz-options, .controls-container header").fadeOut(300, function() {
            $(".question-container").fadeIn(500);
            if (screen.availHeight < 1000) {
                $(".controls-container header").hide();
                let elem = $(".questions")[0];
                elem.scrollIntoView();
            } else {
                $(".heading-text h2").hide();
                $(".controls-container header").fadeIn(500);
                window.scroll(0, 0);
            }
        });
    } else {
        // show quiz options
        $(".next-question").removeClass("finish-button").html(
            `<p class="quiz-score">Score is ${score} / ${setOfQuestions.length}</p>
            Next Question 
            <i class="fas fa-caret-right"></i>`);
        enableElement(".quiz-options .btn");
        $(".load-questions").removeClass("reduce-size").html("Start!");
        $(".question-container").fadeOut(300, function() {
            $(".heading-text h2").show();
            $(".quiz-options, .controls-container header").fadeIn(700);
            if (screen.availHeight < 1000) {
                let elem = $(".mute-sound")[0];
                elem.scrollIntoView();
            } else {
                window.scroll(0, 0);
            }
        });
    }
}

/**
 * Shuffles questions using The Fisher-Yates Shuffle Method
 * @param { Array } arrayOfAnswers - the array to be shuffled
 * @param { string } currentCorrectAnswer - to be pushed into the array before shuffling
 */
function shuffleAnswers(arrayOfAnswers, currentCorrectAnswer) {
    // Validate the array of answers to contain at most, 3 answers
    while (arrayOfAnswers.length > 3) {
        arrayOfAnswers.pop();
    }
    arrayOfAnswers.push(currentCorrectAnswer);
    for (let i = arrayOfAnswers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let k = arrayOfAnswers[i];
        arrayOfAnswers[i] = arrayOfAnswers[j];
        arrayOfAnswers[j] = k;
    }
}

/**
 * Prepares and presents the quiz questions to the screen
 * @param { Object } arrayOfQuestions - current set of questions & answers
 * @param { number } arrayIndex - array index number of current question
 * @param { number } currentScore - number of correct answers current quiz
 */
function askQuestions(arrayOfQuestions, arrayIndex, currentScore) {
    // current question
    let currentQuestion = arrayOfQuestions[arrayIndex].question;
    // array of incorrect answers to current question
    let answersArray = arrayOfQuestions[arrayIndex].incorrect_answers; 
    timer(questionTimer);   
    // Prepare the various buttons
    $(".answer").removeClass("correct-answer wrong-answer no-shadow");
    disableElement(".next-question");
    // Assign the correct answer
    correctAnswer = arrayOfQuestions[arrayIndex].correct_answer;
    shuffleAnswers(answersArray, correctAnswer);
    $(".quiz-score").html(`Score is ${currentScore} / ${setOfQuestions.length}`);
    // check if question is boolean and if yes, hide redundant answer buttons
    displayBooleanQuestion(arrayOfQuestions, arrayIndex, answersArray);    
    $(".questions").html(`${arrayIndex + 1}. ${currentQuestion}`);
    arrayIndex++;
    console.log(answersArray, (correctAnswer));
    console.log(arrayIndex);
}

/**
 * Removes surplus answer buttons if the current question is boolean rather
 * than multiple choice & populates the answer buttons
 * @param { Object } arrayOfQuestions - current set of questions & answers
 * @param { number } arrayIndex - array index number of current question
 * @param { Array } arrayOfAnswers - array of answers to the current question
 */
function displayBooleanQuestion(arrayOfQuestions, arrayIndex, arrayOfAnswers) {
    if (arrayOfQuestions[arrayIndex].type === "boolean") {
        $("[data-number='3']").css("display", "none");
        $("[data-number='4']").css("display", "none");
        // populating answer buttons for boolean choice questions
        $("[data-number='1']").html(`<p>True <span class="tick"></span></p>`);
        $("[data-number='1']").attr("data-answer", "True");
        $("[data-number='2']").html(`<p>False <span class="tick"></span></p>`);
        $("[data-number='2']").attr("data-answer", "False");
    } else {
        $("[data-number='3']").css("display", "block");
        $("[data-number='4']").css("display", "block");
        // populating answer buttons for multiple choice questions
        for (let i = 0; i <= 3; i++) {
            $(`[data-number='${i + 1}']`).html(`<p>${arrayOfAnswers[i]} <span class="tick"></span></p>`);
            $(`[data-number='${i + 1}']`).attr("data-answer", `${arrayOfAnswers[i]}`);
        }
    }        
}

/**
 * Moves the quiz to the next question
 */
function nextQuestionDisplay() {
    buttonPress.play();
    disableElement(".next-question");
    $(".display__time-left").removeClass("time-critical");
    $(".answer-feedback").addClass("hide-element");
    questionIndex++;
    // fade out/in to the next question
    if (questionIndex < setOfQuestions.length) {
        $(".question-container, .status-info").fadeOut(500, function() {
            $(".question-container, .status-info").fadeIn(1000);
            if (screen.availHeight < 1000) {
                let elem = $(".questions")[0];
                elem.scrollIntoView();
            } else {
                window.scroll(0, 0);
            }
        });
        // timeout to allow for the fade out/in of next question
        setTimeout(function() {
            askQuestions(setOfQuestions, questionIndex, score);
        }, 500);
        // timeout to allow the timer to start
        setTimeout(function() {
            $(".answer").removeClass("disable");
        }, 1200);
        // display a finish button for the last question
        if (questionIndex === (setOfQuestions.length - 1)) {
            $(".next-question").addClass("finish-button").html(
                `<p class="quiz-score">Score is ${score} / ${setOfQuestions.length}</p>
                Press To Finish 
                <i class="fas fa-caret-right"></i>`);
            $(".reset-button").hide();
        }
    } else {
        finishQuiz(questionIndex);
    }
}

/**
 * Finishes the quiz by presenting a results model to the screen
 * and updating the high score in local storage if required
 * @param { number } arrayIndex - array index number of current question
 */
function finishQuiz(arrayIndex) {
    let weightedScore = 0;
    $(".modal-content").html(
        `<div class="modal-div">
            <h5 class="reset-modal" id="resetModalLabel">Well Done!</h5>
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary reset-confirm" onclick="resetConfirm()">Exit</button>
        </div>`);
    if (difficulty === "medium") {
        weightedScore = Math.round(score * 1.2);
    } else if (difficulty === "hard") {
        weightedScore = Math.round(score * 1.5);
    } else {
        weightedScore = score;
    }
    if (score === 0) {
        sadSound.play();
        $(".reset-modal").html("Better Luck Next Time!");
    } else if (weightedScore > highScore[categoryString]) {
        highScoreSound.play();
        $(".reset-modal").html(`A New High Score for the ${(categoryString[0].toUpperCase() + categoryString.slice(1, categoryString.length))} Category. Well Done!`);        
    } else {
        wellDoneSound.play();
        $(".reset-modal").html("Well Done!");
    }
    $(".modal-body").html(`You scored ${score} out of ${arrayIndex} questions. The weighted score for ${difficulty} difficulty is ${weightedScore}.`);
    if (weightedScore > highScore[categoryString]) {
        highScore[categoryString] = weightedScore;
        localStorage.setItem("highScore", JSON.stringify(highScore));
        $(".computing-score").html(`${highScore["computing"]}`);
        $(".maths-score").html(`${highScore["mathematics"]}`);
        $(".general-science-score").html(`${highScore["general"]}`);
    }
    $("#resetModal").modal("toggle");
}

/**
 * Submits an answer to be checked and resets the timer
 */
function submitAnswer() {
    clearInterval(countdown);
    $(".display__time-left").html(`Answered with ${secondsLeft} seconds to spare.`).removeClass("time-critical");
    // Check if answer is correct
    setTimeout(function() {
        checkAnswer();
    }, 1200);
}

/**
 * Checks if an answer is correct and provides visual feedback
 */
function checkAnswer() {
    for (let button of answerButtons) {
        if ($(button).hasClass("active") && ($(button).attr("data-answer") === correctAnswer) && (secondsLeft > 0)) {
            correctAnswerSound.play();
            $(".answer-feedback").removeClass("hide-element").html("Well Done. Correct Answer!");
            $(button).removeClass("active").addClass("correct-answer no-shadow");
            $(button).children("p").children("span").html(`<i class="fas fa-check"></i>`);
            score++;
            $(".quiz-score").html(`Score is ${score} / ${setOfQuestions.length}`);
        } else {
            if ($(button).hasClass("active")) {
                wrongAnswerSound.play();
                $(button).removeClass("active").addClass("wrong-answer no-shadow");
                $(button).children("p").children("span").html(`<i class="fas fa-times"></i>`);
                $(".answer-feedback").removeClass("hide-element").html("Bad Luck. Wrong Answer!");
            }
            if (($(button).attr("data-answer") === correctAnswer)) {
                $(button).addClass("correct-answer");
            }
        }
    }
    // on smaller height screens scroll down to show the next question button
    if (setOfQuestions[questionIndex].type != "boolean" && screen.availHeight < 750) {
        setTimeout(function() {
            let elem = $(".question-answers").children(".answer")[0];
            elem.scrollIntoView({behaviour: "smooth"});
        }, 1500);    
    }
    // remove box shadow on all answers after a timeout
    setTimeout(function() {
        $(".answer").addClass("no-shadow");
        enableElement(".next-question");
    }, 1500);
}

/**
 * Used to disable an element on screen
 * @param { Object | string } buttonIdentifier - a button element
 */
function disableElement(buttonIdentifier) {
    $(buttonIdentifier).prop("disabled", true);
}

/**
 * Used to enable an element on screen
 * @param { Object | string } buttonIdentifier - a button element
 */
function enableElement(buttonIdentifier) {
    $(buttonIdentifier).prop("disabled", false);
}

/**
 * Handles error alert messages and displays them in the modal
 * @param { string } errorCode - designates type of error
 * @param { string } errorName - error.name output
 */
function displayErrorModal(errorCode, errorName) {
    let errorMessageDisplay = "";
    if (errorCode === "json-parse-error") {
        errorMessageDisplay = `${errorName}: Quiz Data not in correct format. Try again or refresh the page.`;
    } else if (errorCode === "status-not-ok") {
        errorMessageDisplay = `Cannot communicate with the Quiz Database at this time. Try again or refresh the page.`;
    } else if (errorCode === "token-problem") {
        errorMessageDisplay = `Cannot get results from the Quiz Database at this time. Change quiz options and try again.`;
    } else if (errorCode === "token-parse-error") {
        errorMessageDisplay = `${error.name}: Quiz Token not in correct format. Try again or refresh the page.`;
    }
    $("#resetModal").modal("toggle");
    $(".modal-content").html(
        `<div class="modal-div">
            <h5 class="reset-modal" id="resetModalLabel">Error:</h5>
        </div>
        <div class="modal-body">
            ${errorMessageDisplay} If the problem persists, please contact the administrator.
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal" onclick="buttonPress.play()">Ok</button>
        </div>`);
    $(".load-questions").html("Error. Press to Retry");                
    enableElement(".load-questions");
    enableElement(".quiz-options .btn");
}

/**
 * Gets quiz data object containing questions and answers from the opentdb API
 * @param { string } myToken - token used to access the quiz API
 */
function getQuizData(myToken) {
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${myToken}`;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.send();
    console.log(apiUrl);
    /* Checks the status of the response from the quiz API and when ready and if ok calls to check the 
       status of the token used, otherwise alerts the user to an error obtaining quiz data */
    xhr.onreadystatechange = function () {
        console.log(this.readyState, this.status, score);
        if (this.readyState === 4 && this.status === 200) {
            let questionsLoaded = {};
            try {
                questionsLoaded = JSON.parse(this.responseText);
                // Check the token and start the Quiz
                checkToken(questionsLoaded);
            } catch (error) {
                displayErrorModal("json-parse-error", error.name);
            }            
        } else if (this.readyState === 4 && this.status != 200) {
            displayErrorModal("status-not-ok");
        }
    };
}

/**
 * Checks the token status and if ok begins the quiz, otherwise calls for a new token
 * @param { Object } questionsLoadedObject - quiz data object returned from opentdb API
 */
function checkToken(questionsLoadedObject) {
    score = 0;
    questionIndex = 0;
    console.log("token response", questionsLoadedObject.response_code);
    // response code 0 - successful return of results from api
    if (questionsLoadedObject.response_code === 0) {
        setOfQuestions = questionsLoadedObject.results;
        toggleOptions();
        // Start Quiz
        askQuestions(setOfQuestions, questionIndex, score);
        // response code 3 - session token not found by api
    } else if (questionsLoadedObject.response_code === 3) {
        getToken(tokenUrl).then(handleSuccess, handleFailure);
        // response code 4 - session token is empty and needs to be reset
    } else if (questionsLoadedObject.response_code === 4) {
        let resetTokenUrl = `https://opentdb.com/api_token.php?command=reset&token=${token}`;
        getToken(resetTokenUrl).then(handleSuccess, handleFailure);
    } else {
        // any other response means db could not return results
        displayErrorModal("token-problem");
    }
}

/**
 * Handles a successful response from the getToken function
 */
function handleSuccess(resolvedValue) {
    getQuizData(resolvedValue);
}

/**
 * Handles a rejection of the promise from the getToken function
 */
function handleFailure(rejectionReason) {
    displayErrorModal(rejectionReason);
}

/**
 * Requests a token from the opentdb API
 * @param { string } url - url for obtaining token to access the quiz API
 * @returns { Promise } returns a Promise Object which resolves to contain a token on success
 * or alerts the user to a problem if unsuccessful
 */
function getToken(url) {
    return new Promise(function(myResolve, myReject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        /* Checks the status of the response from the quiz API and when ready and if ok 
            resolves to a token otherwise alerts the user to a problem */
        xhr.onreadystatechange = function() {
            console.log(this.readyState, this.status);
            if (this.readyState === 4 && this.status === 200) {
                try {
                    token = (JSON.parse(this.responseText)).token;
                    sessionStorage.setItem("sessionToken", `${token}`);
                    console.log(token);
                    myResolve(token);
                } catch (error) {
                    displayErrorModal("token-parse-error", error.name);
                }
            } else if (this.readyState === 4 && this.status != 200) {
                myReject("status-not-ok");
            }
        };
    });
}

/**
 * Check if a button is active & gets its data attribute value
 * @param { Object } buttonGroup - represents a group of button elements
 * @returns { string } represents the answer text of that particular button
 */
function activeButton(buttonGroup) {
    for (let button of buttonGroup) {
        if ($(button).hasClass("active")) {
            let buttonValue = button.getAttribute("data-value");            
            return buttonValue;                 
        }
    }
}

// Timer inspired by Wes Bos version here:- https://github.com/wesbos/JavaScript30/blob/master/29%20-%20Countdown%20Timer/scripts-FINISHED.js
/**
 * Countdown Timer
 * @param { number } seconds - Countdown timer starting number of seconds
 */
function timer(seconds) {
    // represents current time
    let now = Date.now();
    // represents current time + timer value converted to milliseconds
    let then = now + seconds * 1000;
    secondsLeft = seconds;
    // clear any existing timers
    clearInterval(countdown);
    displayTimeLeft(seconds);
    // Interval timer which calculates and sets the secondsLeft every 1000ms
    countdown = setInterval(function() {
        secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if timer should be stopped
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        // when timer reaches zero play sound and alert user
        } else if (secondsLeft === 0) {
            for (let button of answerButtons) {
                if (($(button).attr("data-answer") === correctAnswer)) {
                    $(button).addClass("correct-answer");
                    wrongAnswerSound.play();
                    enableElement(".next-question");
                }
                $(".answer").addClass("disable");
            }
        }
        // display it
        displayTimeLeft(secondsLeft);
    }, 1000);
}

/**
 * Displays timer current value on screen
 * @param { number } remainderSeconds - Countdown timer remaining number of seconds
 */
function displayTimeLeft(remainderSeconds) {
    if (remainderSeconds === 0) {
        $(".display__time-left").html("Oops you ran out of time!");
        $(".answer").addClass("no-shadow");
    } else {
        $(".display__time-left").html(`You have <span class="font-weight-bold">${remainderSeconds}</span> seconds remaining.`);
    }
    if (remainderSeconds <= 5) {
        $(".display__time-left").addClass("time-critical");
    } else {
        $(".display__time-left").removeClass("time-critical");
    }
}

/**
 * When the modal confirm button is clicked, stops the timer and returns to quiz options
 */
function resetConfirm() {
    buttonPress.play();
    clearInterval(countdown);
    toggleOptions();
    $("#resetModal").modal("toggle");
    $(".reset-button").show();
    $(".answer").removeClass("disable");
}

/**
 * Shows the modal populated with details to exit the quiz
 */
function showResetModal() {
    buttonPress.play();
    $("#resetModal").modal("toggle");
    $(".modal-content").html(
        `<div class="modal-div">
            <h5 class="reset-modal" id="resetModalLabel">EXIT QUIZ</h5>
        </div>
        <div class="modal-body">
            Please confirm if you would like to exit the quiz...
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal" onclick="buttonPress.play()">No</button>
            <button type="button" class="btn btn-primary reset-confirm" onclick="resetConfirm()">Yes</button>
        </div>`);
}

/**
 * Separates the multiple options bootstrap list groups on the same page 
 * and assigns text values to categories rather than numerical for high score table
 */
function optionButtonsOutput() {
    /* help from stackoverflow with the following two lines to separate the selections in multiple
        bootstrap button groups on same page */
    $(this).addClass("active no-shadow disable");
    $(this).siblings().removeClass("active disable no-shadow");
    category = activeButton(categoryButtons);
    amount = activeButton(quantityButtons);
    difficulty = activeButton(difficultyButtons);
    if (category === "18") {
        categoryString = "computing";
    } else if (category === "19") {
        categoryString = "mathematics";
    } else if (category === "17") {
        categoryString = "general";
    }    
    console.log(categoryString, category, difficulty, amount);
}

/**
 * When button is clicked sets the pre quiz options and checks if a token already exists
 */    
function loadQuestions() {
    buttonPress.play();
    disableElement(".quiz-options .btn");
    $(".load-questions").addClass("reduce-size").html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Loading...");
    $(".answer-feedback").addClass("hide-element");
    if (!!token === false) {
        getToken(tokenUrl).then(handleSuccess).catch(handleFailure);
    } else {
        getQuizData(token);
    }
}

/**
 * When called sound on/off is toggled
 */
function muteSound() {
    let soundOff = "<i class='fas fa-volume-mute'></i>";
    let soundOn = "<i class='fas fa-volume-up'></i>";
    let soundsArray = [correctAnswerSound, wrongAnswerSound, buttonPress, highScoreSound, wellDoneSound, sadSound];
    buttonPress.play();
    if ($(".mute-sound").attr("data-sound") === "off") {
        $(".mute-sound").html(soundOn);
        $(".mute-sound").attr("data-sound", "on");
        for (let item of soundsArray) {
            if (item === buttonPress) {
                item.sound.volume = 0.7;
            } else {
                item.sound.volume = 0.8;
            }                
        }       
    } else {
        $(".mute-sound").html(soundOff);
        $(".mute-sound").attr("data-sound", "off");
        for (let item of soundsArray) {
            item.sound.volume = 0;
        }
    }
}

// Click Events ###################################################################################

// Mute Sound Button
$(".mute-sound").on("click", muteSound);

// Answer Button
$(".answer").on("click", function() {
    submitAnswer();
    $(this).addClass("active no-shadow disable");
    $(this).siblings().addClass("disable");    
});

// Start Button
$(".load-questions").click(loadQuestions);

// Next Question or Finish Quiz Button
$(".next-question").on("click", nextQuestionDisplay);

// When the Exit Quiz button is clicked displays a modal for the user to confirm
$(".reset-button").on("click", showResetModal);

// Plays a sound when any button is clicked
$("button").on("click", function() {
    buttonPress.play();
});

// function optionButtonsOutput is called when any quiz option button is clicked
$("body").on("click", ".quiz-options .btn", optionButtonsOutput);