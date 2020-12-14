// Scrolls window to top on page load
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
        this.sound.volume = 0.8;
        this.sound.muted = true;
        document.body.appendChild(this.sound);
        // plays a sound file
        this.play = function() {
            this.sound.play();
        };
        this.stop = function() {
            this.sound.pause();
        };
    }
}

/**
 * @class - Represents all parameters associated with a Quiz Game
 */
class Quiz {
    constructor() {
        // category of questions selected
        this.category = "18";
        // quantity of questions selected
        this.amount = "5";
        // difficulty level of questions selected
        this.difficulty = "easy";
        // translates the category from numerical identifier to text
        this.categoryString = "computing";
        // token to access API
        this.token = "";
        // correct answer to current question
        this.correctAnswer = "";
        // number of correct answers current quiz
        this.score = 0;
        // array index number of current question
        this.questionIndex = 0;
        // current set of questions & answers
        this.setOfQuestions = {};
        // question timer length in seconds
        this.questionTimer = 22;
    }
}

// Declare Global variables  ######################################################################

// Create new instance of the Quiz class called scienceQuiz
let scienceQuiz = new Quiz();
// highest score achieved by user in each category represented as an object
let highScore = {};
// number of seconds remaining on the timer
let secondsLeft = scienceQuiz.questionTimer;
// the id of the setInterval timer function
let countdown = 0;
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
// contains buttons representing quiz category options
let categoryButtons = $(".categories").children("button");
// contains buttons representing quiz difficulty options
let difficultyButtons = $(".difficulty-level").children("button");
// contains buttons representing quiz quantity of questions options
let quantityButtons = $(".question-quantity").children("button");

// Check and retrieve Local and Session Storage Values  ######################################################################

// Checks local storage for a high score object
if (localStorage.getItem("highScore")) {
    highScore = JSON.parse(localStorage.getItem("highScore"));
    $(".computing-score").html(`${highScore.computing}`);
    $(".maths-score").html(`${highScore.mathematics}`);
    $(".general-science-score").html(`${highScore.general}`);
} else {
    highScore = {
        computing: 0,
        mathematics: 0,
        general: 0
    };
}

// Checks session storage if a token already exists
if (sessionStorage.getItem("sessionToken")) {
    scienceQuiz.token = sessionStorage.getItem("sessionToken");
}

// Regular Functions  ######################################################################
/**
 * Switches between quiz options OR quiz questions/answers
 */
function toggleOptions() {
    // show quiz questions and answers
    if ($(".quiz-options").css("display") != "none") {
        $(".next-question").addClass("no-shadow");
        // timeout to allow countdown timer to start
        setTimeout(function() {
            enableElement(".answer");
            $(".answer").removeClass("disable no-shadow");
        }, 1200);
        $(".quiz-options, .controls-container header").fadeOut(500, function() {
            $(".question-container").fadeIn(600);
            if (screen.availHeight < 1000) {
                $(".controls-container header").hide();
                let elem = $(".questions")[0];
                elem.scrollIntoView();
            } else {
                $(".heading-text h2").hide();
                $(".controls-container header").fadeIn(600);
                window.scroll(0, 0);
            }
        });
    } else {
        // show quiz options
        $(".answer").addClass("no-shadow");
        // Change Finish button back to Next Question Button with timeout to allow for fadeout
        setTimeout(function() {
            $(".next-question").removeClass("finish-button").html(
                `<p class="quiz-score">Score is ${scienceQuiz.score} / ${scienceQuiz.setOfQuestions.length}</p>
                Next Question 
                <i class="fas fa-caret-right"></i>`);
        }, 600);        
        enableElement(".quiz-options .btn");
        $(".load-questions").removeClass("reduce-size").html("Start!");
        $(".question-container").fadeOut(500, function() {
            $(".heading-text h2").show();
            $(".quiz-options, .controls-container header").fadeIn(600);
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
    timer(scienceQuiz.questionTimer);
    // Prepare the various buttons
    $(".answer").removeClass("correct-answer wrong-answer");
    disableElement(".next-question");
    // Assign the correct answer
    scienceQuiz.correctAnswer = arrayOfQuestions[arrayIndex].correct_answer;
    shuffleAnswers(answersArray, scienceQuiz.correctAnswer);
    $(".quiz-score").html(`Score is ${currentScore} / ${scienceQuiz.setOfQuestions.length}`);
    // check if question is boolean and if yes, hide redundant answer buttons
    displayBooleanQuestion(arrayOfQuestions, arrayIndex, answersArray);
    $(".questions").html(`${arrayIndex + 1}. ${currentQuestion}`);
    arrayIndex++;
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
    disableElement(".next-question");
    $(".next-question").addClass("no-shadow");
    $(".time-left").removeClass("time-critical");
    $(".answer-feedback").addClass("hide-element");
    scienceQuiz.questionIndex++;
    // fade out/in to the next question
    if (scienceQuiz.questionIndex < scienceQuiz.setOfQuestions.length) {
        $(".question-container, .status-info").fadeOut(500, function() {
            $(".question-container, .status-info").fadeIn(600);
            if (screen.availHeight < 1000) {
                let elem = $(".questions")[0];
                elem.scrollIntoView();
            } else {
                window.scroll(0, 0);
            }
        });
        // timeout to allow for the fade out/in of next question
        setTimeout(function() {
            askQuestions(scienceQuiz.setOfQuestions, scienceQuiz.questionIndex, scienceQuiz.score);
            // display a finish button for the last question
            if (scienceQuiz.questionIndex === (scienceQuiz.setOfQuestions.length - 1)) {
                $(".next-question").addClass("finish-button").html(
                    `<p class="quiz-score">Score is ${scienceQuiz.score} / ${scienceQuiz.setOfQuestions.length}</p>
                    Press To Finish 
                    <i class="fas fa-caret-right"></i>`);
                $(".reset-button").hide();
            }
        }, 500);
        // timeout to allow the timer to start
        setTimeout(function() {
            $(".answer").removeClass("no-shadow");
            enableElement(".answer");
        }, 1200);
    } else {
        finishQuiz(scienceQuiz.questionIndex);
    }
}

/**
 * Finishes the quiz by presenting a results modal to the screen
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
            <button type="button" class="btn btn-primary reset-confirm">Exit</button>
        </div>`);
    if (scienceQuiz.difficulty === "medium") {
        weightedScore = Math.round(scienceQuiz.score * 1.2);
    } else if (scienceQuiz.difficulty === "hard") {
        weightedScore = Math.round(scienceQuiz.score * 1.5);
    } else {
        weightedScore = scienceQuiz.score;
    }
    if (scienceQuiz.score === 0) {
        sadSound.play();
        $(".reset-modal").html("Better Luck Next Time!");
    } else if (weightedScore > highScore[scienceQuiz.categoryString]) {
        highScoreSound.play();
        $(".reset-modal").html(
            `A New High Score for the ${(scienceQuiz.categoryString[0].toUpperCase() + scienceQuiz.categoryString.slice(1, scienceQuiz.categoryString.length))} Category. Well Done!`
        );
    } else {
        wellDoneSound.play();
        $(".reset-modal").html("Well Done!");
    }
    $(".modal-body").html(
        `You scored ${scienceQuiz.score} out of ${arrayIndex} questions.<br>The weighted score for ${scienceQuiz.difficulty} difficulty is ${weightedScore}.`
        );
    if (weightedScore > highScore[scienceQuiz.categoryString]) {
        highScore[scienceQuiz.categoryString] = weightedScore;
        localStorage.setItem("highScore", JSON.stringify(highScore));
        $(".computing-score").html(`${highScore.computing}`);
        $(".maths-score").html(`${highScore.mathematics}`);
        $(".general-science-score").html(`${highScore.general}`);
    }
    $("#resetModal").modal("toggle");
}

/**
 * Submits an answer to be checked and resets the timer
 */
function submitAnswer() {
    clearInterval(countdown);
    $(".time-left").html(`Answered with ${secondsLeft} seconds to spare.`).removeClass("time-critical");
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
        if ($(button).hasClass("active") && ($(button).attr("data-answer") === scienceQuiz.correctAnswer) && (secondsLeft > 0)) {
            correctAnswerSound.play();
            $(".answer-feedback").removeClass("hide-element").html("Well Done. Correct Answer!");
            $(button).removeClass("active").addClass("correct-answer");
            $(button).children("p").children("span").html(`<i class="fas fa-check"></i>`);
            scienceQuiz.score++;
            $(".quiz-score").html(`Score is ${scienceQuiz.score} / ${scienceQuiz.setOfQuestions.length}`);
        } else {
            if ($(button).hasClass("active")) {
                wrongAnswerSound.play();
                $(button).removeClass("active").addClass("wrong-answer");
                $(button).children("p").children("span").html(`<i class="fas fa-times"></i>`);
                $(".answer-feedback").removeClass("hide-element").html("Bad Luck. Wrong Answer!");
            }
            if (($(button).attr("data-answer") === scienceQuiz.correctAnswer)) {
                $(button).addClass("correct-answer");
            }
        }
    }
    // on smaller height screens scroll down to show the next question button
    if ((scienceQuiz.setOfQuestions[scienceQuiz.questionIndex].type != "boolean" && screen.availHeight < 750) || (screen.availHeight < 580)) {
        setTimeout(function() {
            let elem = $(".action-button")[0];
            elem.scrollIntoView(false);
        }, 1500);
    }
    // remove box shadow on all answers after a timeout
    setTimeout(function() {
        $(".answer").addClass("no-shadow");
        $(".answer").removeClass("disable");
        enableElement(".next-question");
        $(".next-question").removeClass("no-shadow");
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
 * Gets quiz data object containing questions and answers from the opentdb API
 * @param { string } myToken - token used to access the quiz API
 */
function getQuizData(myToken) {
    let apiUrl = `https://opentdb.com/api.php?amount=${scienceQuiz.amount}&category=${scienceQuiz.category}&difficulty=${scienceQuiz.difficulty}&token=${myToken}`;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.send();
    /* Checks the status of the response from the quiz API and when ready and if ok, calls to check the 
       status of the token used, otherwise displays a modal to the user of the error obtaining quiz data */
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let questionsLoaded = {};
            try {
                questionsLoaded = JSON.parse(this.responseText);
                // Check the token and start the Quiz
                checkToken(questionsLoaded);
            } 
            catch (error) {
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
    scienceQuiz.score = 0;
    scienceQuiz.questionIndex = 0;
    // A response code 0 means a successful return of results from api
    if (questionsLoadedObject.response_code === 0) {
        scienceQuiz.setOfQuestions = questionsLoadedObject.results;
        toggleOptions();
        // Start Quiz
        askQuestions(scienceQuiz.setOfQuestions, scienceQuiz.questionIndex, scienceQuiz.score);
        // response code 3 - session token not found by api
    } else if (questionsLoadedObject.response_code === 3) {
        // opentdb API url address to obtain token
        let tokenUrl = "https://opentdb.com/api_token.php?command=request";
        getToken(tokenUrl).then(handleSuccess, handleFailure);
        // response code 4 - session token is empty and needs to be reset
    } else if (questionsLoadedObject.response_code === 4) {
        let resetTokenUrl = `https://opentdb.com/api_token.php?command=reset&token=${scienceQuiz.token}`;
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
 * or displays a modal to the user of a problem if unsuccessful
 */
function getToken(url) {
    return new Promise(function(myResolve, myReject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        /* Checks the status of the response from the quiz API and when ready and if ok 
            resolves to a token otherwise displays a modal to the user of a problem */
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                try {
                    scienceQuiz.token = (JSON.parse(this.responseText)).token;
                    sessionStorage.setItem("sessionToken", `${scienceQuiz.token}`);
                    myResolve(scienceQuiz.token);
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
 * Used to display error messages to the user in a modal
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
        errorMessageDisplay = `${errorName}: Quiz Token not in correct format. Try again or refresh the page.`;
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
            <button type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal">Ok</button>
        </div>`
    );
    $(".load-questions").html("Press to Retry");
    enableElement(".load-questions");
    enableElement(".quiz-options .btn");
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
            // when timer reaches zero play a sound and display the correct answer to alert the user
        } else if (secondsLeft === 0) {
            for (let button of answerButtons) {
                if (($(button).attr("data-answer") === scienceQuiz.correctAnswer)) {
                    $(button).addClass("correct-answer");
                    wrongAnswerSound.play();
                }
                enableElement(".next-question");
                $(".next-question").removeClass("no-shadow");
                disableElement(".answer");
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
        $(".time-left").html("Oops you ran out of time!");
        $(".answer").addClass("no-shadow");
    } else {
        $(".time-left").html(`You have <span class="font-weight-bold">${remainderSeconds}</span> seconds remaining.`);
    }
    if (remainderSeconds <= 5) {
        $(".time-left").addClass("time-critical");
    } else {
        $(".time-left").removeClass("time-critical");
    }
}

/**
 * When the modal confirm button is clicked, stops the timer and returns to quiz options
 */
function resetConfirm() {
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
    $("#resetModal").modal("toggle");
    $(".modal-content").html(
        `<div class="modal-div">
            <h5 class="reset-modal" id="resetModalLabel">EXIT QUIZ</h5>
        </div>
        <div class="modal-body">
            Please confirm if you would like to exit the quiz...
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-primary reset-confirm">Yes</button>
        </div>`
    );
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
    scienceQuiz.category = activeButton(categoryButtons);
    scienceQuiz.amount = activeButton(quantityButtons);
    scienceQuiz.difficulty = activeButton(difficultyButtons);
    if (scienceQuiz.category === "18") {
        scienceQuiz.categoryString = "computing";
    } else if (scienceQuiz.category === "19") {
        scienceQuiz.categoryString = "mathematics";
    } else if (scienceQuiz.category === "17") {
        scienceQuiz.categoryString = "general";
    }
}

/**
 * When Start button is clicked sets the pre quiz options and checks if a token already exists
 */
function loadQuestions() {
    disableElement(".quiz-options .btn");
    $(".load-questions").addClass("reduce-size").html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Loading...");
    $(".answer-feedback").addClass("hide-element");
    if (Boolean(scienceQuiz.token) === false) {
        // opentdb API url address to obtain token
        let tokenUrl = "https://opentdb.com/api_token.php?command=request";
        getToken(tokenUrl).then(handleSuccess).catch(handleFailure);
    } else {
        getQuizData(scienceQuiz.token);
    }
}

/**
 * When called sound on/off is toggled
 */
function muteSound() {
    let soundOff = "<i class='fas fa-volume-mute'></i>";
    let soundOn = "<i class='fas fa-volume-up'></i>";
    let soundsArray = [buttonPress, correctAnswerSound, wrongAnswerSound, highScoreSound, wellDoneSound, sadSound];
    if ($(".mute-sound").attr("data-sound") === "off") {
        $(".mute-sound").html(soundOn);
        $(".mute-sound").attr("data-sound", "on");
        buttonPress.sound.volume = 0.7;
        for (let item of soundsArray) {
            item.sound.muted = false;
        }
        buttonPress.play();
    } else {
        $(".mute-sound").html(soundOff);
        $(".mute-sound").attr("data-sound", "off");
        for (let item of soundsArray) {
            item.sound.muted = true;
        }
    }
}

// Click Events ###################################################################################

// Mute Sound Button
$(".mute-sound").click(muteSound);

// Exit Quiz Modal reset confirm button
$("#resetModal").on("click", ".reset-confirm", resetConfirm);

// Answer Button
$(".answer").click(function() {
    submitAnswer();
    $(this).addClass("active no-shadow");
    $(this).siblings("button").addClass("disable");
    disableElement(".answer");
});

// Start Button
$(".load-questions").click(loadQuestions);

// Next Question or Finish Quiz Button
$(".next-question").click(nextQuestionDisplay);

// When the Exit Quiz button is clicked displays a modal for the user to confirm
$(".reset-button").click(showResetModal);    

// Plays a sound when any button is clicked 
$("body").on("click", ".btn", function() {
    buttonPress.play();
});
$(":button").click(function() {
    buttonPress.play();
});

// function optionButtonsOutput is called when any quiz option button is clicked
$("body").on("click", ".quiz-options .btn", optionButtonsOutput);