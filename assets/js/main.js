$(document).ready(function() {

});
// Declare Classes  ######################################################################
/**
 * @class - Represents all page sound effects
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
/** @type { string } category of questions selected */
let category = "18";
/** @type { string } quantity of questions selected */
let amount = "5";
/** @type { string } difficulty level of questions selected */
let difficulty = "easy";
/** @type { string } token to access API */
let token = "";
/** @type { string } correct answer to current question */
let correctAnswer = "";
/** @type { number } number of correct answers current quiz */
let score = 0;
/** @type { number } array index number of current question */
let questionIndex = 0;
/** @type { Object } current set of questions & answers */
let setOfQuestions = {};
/** @type { Object } highest score achieved by user in each category represented as an object */
let highScore = 0;
/** @type { number } the id of the setInterval timer function */
let countdown = 0;
/** @type { number } number of seconds remaining on the timer */
let secondsLeft = 0;
/** @type { number } question timer length in seconds */
let questionTimer = 20;
/** @type { Object } new instance of the sound class representing a correct answer */
let correctAnswerSound = new Sound("assets/sounds/correct-answer.wav");
/** @type { Object } new instance of the sound class representing a wrong answer */
let wrongAnswerSound = new Sound("assets/sounds/wrong-answer.wav");
/** @type { Object } new instance of the sound class representing a button press */
let buttonPress = new Sound("assets/sounds/button-press.wav");
/** @type { Object } new instance of the sound class representing a new high score */
let highScoreSound = new Sound("assets/sounds/new-high-score.wav");
/** @type { Object } new instance of the sound class representing a well done score */
let wellDoneSound = new Sound("assets/sounds/well-done.wav");
/** @type { Object } new instance of the sound class representing a sad score */
let sadSound = new Sound("assets/sounds/sad-sound.wav");
/** @type { Object } contains all answer buttons */
let answerButtons = $(".question-answers").children("button");
/** @type { string } opentdb API url address to obtain token */
let tokenUrl = "https://opentdb.com/api_token.php?command=request";
/** @type { Object } contains buttons representing quiz category options */
let categoryButtons = $(".categories").children("button");
/** @type { Object } contains buttons representing quiz difficulty options */
let difficultyButtons = $(".difficulty-level").children("button");
/** @type { Object } contains buttons representing quiz quantity of questions options */
let quantityButtons = $(".question-quantity").children("button");
/** @type { string } translates the category from numerical identifier to text */
let categoryString = "";
/** @type { string } general error message to be alerted to user */
let alertErrorMessage = "Press below to try again or refresh the page. If the problem persists, please contact the administrator.";

// Check and retrieve Local and Session Storage Values  ######################################################################
/**
 * Checks local storage for a high score object
 */
if (localStorage.getItem("highScore")) {
    console.log("highscore exists");    
    highScore = JSON.parse(localStorage.getItem("highScore"));
    $(".computing-score").html(`${highScore["computing"]}`);
    $(".maths-score").html(`${highScore["mathematics"]}`);
    $(".nature-score").html(`${highScore["nature"]}`);
} else {
    highScore = {
    computing: 0,
    mathematics: 0,
    nature: 0 
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
 * @function - switches between quiz options and quiz questions
 * @returns { void } nothing
 */
function toggleOptions() {
    // show quiz questions and answers
    if ($(".quiz-options").css("display") != "none") {
        $(".quiz-options, .controls-container header").fadeOut(300, function() {
            $(".question-container").fadeIn(500);
            window.scroll(0, 90);
            if (screen.availHeight < 1000) {
                $(".controls-container header").hide();
            } else {
                $(".controls-container header").fadeIn(500);
            }
        });
    } else {
        // show quiz options
        $(".next-question").removeClass("finish-button").html(
            `<p class="quiz-score">Score is ${score} / ${setOfQuestions.length}</p>
            Next Question 
            <i class="fas fa-caret-right"></i>`);
        enableElement(".load-questions");
        $(".load-questions").removeClass("reduce-size").html("Start!");
        $(".question-container").fadeOut(300, function() {
            window.scroll(0, 60);
            $(".quiz-options, .controls-container header").fadeIn(700);
        });
    }
}

/**
 * @function - Shuffles questions using The Fisher-Yates Shuffle Method
 * @param { Array } arrayOfAnswers - the array to be shuffled
 * @param { string } currentCorrectAnswer - to be pushed into the array before shuffling
 * @returns { void } nothing
 */
function shuffleAnswers(arrayOfAnswers, currentCorrectAnswer) {
    // Validate the array of answers to contain at most, 3 answers
    if (arrayOfAnswers.length > 4) {
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
 * @function - Prepares and presents the quiz questions to the screen
 * @param { Object } arrayOfQuestions - current set of questions & answers
 * @param { number } arrayIndex - array index number of current question
 * @param { number } currentScore - number of correct answers current quiz
 * @returns { void } nothing
 */
function askQuestions(arrayOfQuestions, arrayIndex, currentScore) {
    /** @type { string } current question */
    let currentQuestion = arrayOfQuestions[arrayIndex].question;
    /** @type { Array } array of incorrect answers to current question */
    let answersArray = arrayOfQuestions[arrayIndex].incorrect_answers;    
    // Prepare the various buttons
    $(".answer").removeClass("correct-answer wrong-answer");
    disableElement(".next-question");
    // Assign the correct answer
    correctAnswer = arrayOfQuestions[arrayIndex].correct_answer;
    shuffleAnswers(answersArray, correctAnswer);
    $(".quiz-score").html(`Score is ${currentScore} / ${setOfQuestions.length}`);
    // check if question is boolean and if yes, hide redundant answer buttons
    checkBoolean(arrayOfQuestions, arrayIndex, answersArray);    
    $(".questions").html(`${arrayIndex + 1}. ${currentQuestion}`);
    arrayIndex++;
    timer(questionTimer);
    console.log(answersArray, (correctAnswer));
    console.log(arrayIndex);
}

/**
 * @function - Removes surplus answer buttons if the current question
 * is boolean rather than multiple choice & populates the answer buttons
 * @param { Object } arrayOfQuestions - current set of questions & answers
 * @param { number } arrayIndex - array index number of current question
 * @param { Array } arrayOfAnswers - array of answers to the current question
 * @returns { void } nothing
 */
function checkBoolean(arrayOfQuestions, arrayIndex, arrayOfAnswers) {
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
 * @function - Moves the quiz to the next question
 * @returns { void } nothing
 */
function nextQuestion() {
    buttonPress.play();
    disableElement(".next-question");
    $(".display__time-left").removeClass("time-critical");
    $(".answer-feedback").addClass("hide-element");
    questionIndex++;
    if (questionIndex < setOfQuestions.length) {
        $(".answer").removeClass("disable");
        $(".question-container, .status-info").fadeOut(500, function() {
            window.scroll(0, 90);
            $(".question-container, .status-info").fadeIn(1000);
        });
        setTimeout(function() {
            askQuestions(setOfQuestions, questionIndex, score);
        }, 500);
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
 * @function - Finishes the quiz by presenting a results model to the screen
 * and updating the high score in local storage if required
 * @param { number } arrayIndex - array index number of current question
 * @returns { void } nothing
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
        $(".nature-score").html(`${highScore["nature"]}`);
    }
    $("#resetModal").modal("toggle");
}

/**
 * @function - Submits an answer to be checked and resets the timer
 * @returns { void } nothing
 */
function submitAnswer() {
    clearInterval(countdown);
    $(".display__time-left").html(`You answered with ${secondsLeft} seconds to spare.`).removeClass("time-critical");
    // Check if answer is correct
    setTimeout(() => {
        checkAnswer();
        enableElement(".next-question");
    }, 800);
}

/**
 * @function - Checks if an answer is correct and provides visual feedback
 * @returns { void } nothing
 */
function checkAnswer() {
    for (let button of answerButtons) {
        if ($(button).hasClass("active") && ($(button).attr("data-answer") === correctAnswer) && (secondsLeft > 0)) {
            correctAnswerSound.play();
            $(".answer-feedback").removeClass("hide-element").html("Well Done. Correct Answer!");
            $(button).removeClass("active").addClass("correct-answer");
            $(button).children("p").children("span").html(`<i class="fas fa-check"></i>`);
            score++;
            $(".quiz-score").html(`Score is ${score} / ${setOfQuestions.length}`);
        } else {
            if ($(button).hasClass("active")) {
                $(button).removeClass("active").addClass("wrong-answer");
                $(button).children("p").children("span").html(`<i class="fas fa-times"></i>`);
                wrongAnswerSound.play();
                $(".answer-feedback").removeClass("hide-element").html("Bad Luck. Wrong Answer!");
            }
            if (($(button).attr("data-answer") === correctAnswer)) {
                $(button).addClass("correct-answer");
            }
        }
    }
    if (setOfQuestions[questionIndex].type != "boolean" && screen.availHeight < 750) {
            console.log(screen.availHeight)
            window.scroll(0, 225);
        }
}

/**
 * @function - Used to disable an element on screen
 * @param { Object | string } buttonIdentifier - a button element
 * @returns { void } nothing
 */
function disableElement(buttonIdentifier) {
    $(buttonIdentifier).prop("disabled", true);
    $(buttonIdentifier).attr("aria-disabled", "true");
}

/**
 * @function - Used to enable an element on screen
 * @param { Object | string } buttonIdentifier - a button element
 * @returns { void } nothing
 */
function enableElement(buttonIdentifier) {
    $(buttonIdentifier).prop("disabled", false);
    $(buttonIdentifier).attr("aria-disabled", "false");
}

/**
 * @function - Gets quiz data object containing questions and answers from the opentdb API
 * @param { string } myToken - token used to access the quiz API
 * @returns { void } nothing
 */
function getQuizData(myToken) {
    /** @type { string } opentdb API url address */
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${myToken}`;
    /** @type { Object } new instance of the object XMLHttpRequest */
    let xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.send();
    console.log(apiUrl);
    /**
     * @function - Checks the status of the response from the quiz API and when ready and if ok calls to check the 
     * status of the token used otherwise alerts the user to an error obtaining quiz data
     * @returns { void } nothing
     */
    xhr.onreadystatechange = function () {
        console.log(this.readyState, this.status, score);
        if (this.readyState === 4 && this.status === 200) {
            /** @type { Object } Will represent quiz data returned from opentdb API */
            let questionsLoaded = {};
            try {
                questionsLoaded = JSON.parse(this.responseText);
                // Check the token and start the Quiz
                checkToken(questionsLoaded);
            } catch (error) {
                $(".load-questions").html("Error. Press to Retry");
                alert(`${error.name}: Quiz Data not in correct format. ${alertErrorMessage}.`);
            }            
        } else if (this.readyState === 4 && this.status != 200) {
            $(".load-questions").html("Error. Press to Retry");
            alert(`Cannot communicate with the Quiz Database. ${alertErrorMessage}.`);
        }
    };
}

/**
 * @function - Checks the token status and if ok begins the quiz, otherwise calls for a new token
 * @param { Object } questionsLoadedObject - quiz data object returned from opentdb API
 * @returns { void } nothing
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
        /** @type { string } opentdb API url address to reset token */
        let resetTokenUrl = `https://opentdb.com/api_token.php?command=reset&token=${token}`;
        getToken(resetTokenUrl).then(handleSuccess, handleFailure);
    } else {
        // any other response means db could not return results
        alert(`Cannot get results from the Quiz Database. ${alertErrorMessage}.`);
        $(".load-questions").html("Error. Press to Retry");
    }
}

/**
 * @function - Handles a successful rsponse from the getToken function
 * @returns { void } nothing
 */
function handleSuccess(resolvedValue) {
    getQuizData(resolvedValue);
}

/**
 * @function - Handles an unsuccesful response from the getToken function
 * @returns { void } nothing
 */
function handleFailure(rejectionReason) {
    alert(rejectionReason);
}

/**
 * @function - Requests a token from the opentdb API
 * @param { string } url - url for obtaining token to access the quiz API
 * @returns { Promise } returns a Promise Object which resolves to contain a token on success
 * or alerts the user to a problem if unsuccessful
 */
function getToken(url) {
    return new Promise(function(myResolve, myReject) {        
        /** @type { Object } new instance of the object XMLHttpRequest */
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        /**
         * @function - Checks the status of the response from the quiz API and when ready and if ok 
         * resolves to a token otherwise alerts the user to a problem
         */
        xhr.onreadystatechange = function() {
            console.log(this.readyState, this.status);
            if (this.readyState === 4 && this.status === 200) {
                try {
                    token = (JSON.parse(this.responseText)).token;
                    sessionStorage.setItem("sessionToken", `${token}`);
                    console.log(token);
                    myResolve(token);
                } catch (error) {
                    $(".load-questions").html("Error. Press to Retry");
                    alert(`${error.name}: Quiz Token not in correct format. ${alertErrorMessage}.`);
                }
            } else if (this.readyState === 4 && this.status != 200) {
                $(".load-questions").html("Error. Press to Retry");
                myReject(`Cannot obtain Quiz Token. ${alertErrorMessage}.`);
            }
        };
    });
}

/**
 * @function - Check if a button is active & gets its data attribute value
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
 * @function - Countdown Timer
 * @param { number } seconds - Countdown timer starting number of seconds
 * @returns { void } nothing
 */
function timer(seconds) {
    /** @type { number } represents current time */
    let now = Date.now();
    /** @type { number } represents current time + timer value converted to milliseconds */
    let then = now + seconds * 1000;
    // clear any existing timers
    clearInterval(countdown);
    displayTimeLeft(seconds);
    /**
     * @function - Interval timer which calculated and sets the secondsLeft every 1000ms
     */
    countdown = setInterval(() => {
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
 * @function - Displays timer current value on screen
 * @param { number } remainderSeconds - Countdown timer remaining number of seconds
 * @returns { void } nothing
 */
function displayTimeLeft(remainderSeconds) {
    if (remainderSeconds === 0) {
        $(".display__time-left").html("Oops you ran out of time!");
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
 * @function - When the modal confirm button is clicked, stops the timer and returns to quiz options
 * @returns { void } nothing
 */
function resetConfirm() {
    buttonPress.play();
    clearInterval(countdown);
    toggleOptions();
    $("#resetModal").modal("toggle");
    $(".reset-button").show();
    $(".answer").removeClass("disable");
}

// Click Event Functions  ######################################################################
/**
 * @fires - When clicked sound on/off is toggled
 * @returns { void } nothing
 */
$(".mute-sound").on("click", function() {
    let soundOff = "<i class='fas fa-volume-mute'></i>";
    let soundOn = "<i class='fas fa-volume-up'></i>";
    buttonPress.play();
    if ($(".mute-sound").attr("data-sound") === "off") {
        $(".mute-sound").html(soundOn);
        $(".mute-sound").attr("data-sound", "on");
        correctAnswerSound.sound.volume = 0.8;
        wrongAnswerSound.sound.volume = 0.8;
        buttonPress.sound.volume = 0.7;
        highScoreSound.sound.volume = 0.8;
        wellDoneSound.sound.volume = 0.8;
        sadSound.sound.volume = 0.8;
    } else {
        $(".mute-sound").html(soundOff);
        $(".mute-sound").attr("data-sound", "off");
        correctAnswerSound.sound.volume = 0;
        wrongAnswerSound.sound.volume = 0;
        buttonPress.sound.volume = 0;
        highScoreSound.sound.volume = 0;
        wellDoneSound.sound.volume = 0;
        sadSound.sound.volume = 0;
    }
});

/**
 * @fires - When button is clicked sets the pre quiz options and checks if a token already exists
 * @returns { void } nothing
 */
$(".load-questions").click(function() {
    buttonPress.play();
    disableElement(".load-questions");
    $(".load-questions").addClass("reduce-size").html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Loading...");
    $(".answer-feedback").addClass("hide-element");
    if (!!token === false) {
        getToken(tokenUrl).then(handleSuccess).catch(handleFailure);
    } else {
        getQuizData(token);
    }
});

/**
 * @fires - When the next question button is clicked calls the nextQuestion function
 * @returns { void } nothing
 */
$(".answer").on("click", function() {
    submitAnswer();
    $(".answer").addClass("disable");
});

/**
 * @fires - When the next question button is clicked calls the nextQuestion function
 * @returns { void } nothing
 */
$(".next-question").on("click", nextQuestion);

/**
 * @fires - When the Exit Quiz button is clicked displays a modal for the user to confirm
 * @returns { void } nothing
 */
$(".reset-button").on("click", function() {
    buttonPress.play();
    $(".modal-cancel").show();
    $(".reset-confirm").html("Yes");
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
});

/**
 * @fires - Plays a sound when any button is clicked
 * @returns { void } nothing
 */
$("button").on("click", function() {
    buttonPress.play();
});

/**
 * @fires - Separates the multiple options bootstrap list groups on the same page 
 * and assigns text values to categories rather than numerical for high score table
 * @returns { void } nothing
 */
$("body").on("click", ".list-group .btn", function() {
    /* help from stackoverflow with the following two lines to separate the selections in multiple
        bootstrap button groups on same page */
    $(this).addClass("active");
    $(this).siblings().removeClass("active");    
    category = activeButton(categoryButtons);
    amount = activeButton(quantityButtons);
    difficulty = activeButton(difficultyButtons);
    if (category === "18") {
        categoryString = "computing";
    } else if (category === "19") {
        categoryString = "mathematics";
    } else if (category === "17") {
        categoryString = "nature";
    }    
    console.log(categoryString, category, difficulty, amount);
});