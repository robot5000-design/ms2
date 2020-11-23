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
/** @type { number } quantity of questions selected */
let amount = 0;
/** @type { number } category of questions selected */
let category = 18;
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
/** @type { number } highest score achieved by user */
let highScore = 0;
/** @type { number } the id of the setInterval timer function */
let countdown = 0;
/** @type { number } number of seconds remaining on the timer */
let secondsLeft = 0;
/** @type { Object } new instance of the sound class representing a correct answer */
let correctAnswerSound = new Sound("assets/sounds/correct-answer.wav");
/** @type { Object } new instance of the sound class representing a wrong answer */
let wrongAnswerSound = new Sound("assets/sounds/wrong-answer.wav");
/** @type { Object } new instance of the sound class representing a button press */
let buttonPress = new Sound("assets/sounds/button-press.wav");
/** @type { Object } contains all answer buttons */
let answerButtons = $(".question-answers").children("button");
/** @type { string } opentdb API url address to obtain token */
let tokenUrl = "https://opentdb.com/api_token.php?command=request"

//let categoryString =""



// Normal Functions  ######################################################################
/**
 * @function - switches between quiz options and quiz questions
 * @returns { void } nothing
 */
function toggleOptions() {
    if ($(".quiz-options").css("display") != "none") {
        $(".quiz-options").removeClass("reinstate-element").addClass("remove-element");
        $(".question-container").removeClass("remove-element").addClass("reinstate-element");
        if (screen.availHeight < 1000) {
            $(".controls-container header").hide();
        }
    } else {
        $(".controls-container header").show();
        $(".next-question").html(
            `<p class="quiz-score">Score is ${score} / ${setOfQuestions.length}</p>
            Next Question 
            <i class="fas fa-caret-right"></i>`);
        $(".load-questions").html("Start!");
        $(".quiz-options").removeClass("remove-element").addClass("reinstate-element");
        $(".question-container").removeClass("reinstate-element").addClass("remove-element");
    }
}

/**
 * @function - Shuffles questions using The Fisher-Yates Shuffle Method
 * @param { Array } arrayOfAnswers - the array to be shuffled
 * @param { string } currentCorrectAnswer - to be pushed into the array before shuffling
 * @returns { void } nothing
 */
function shuffleAnswers(arrayOfAnswers, currentCorrectAnswer) {
    arrayOfAnswers.push(currentCorrectAnswer);
    for (let i = arrayOfAnswers.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * i);
        k = arrayOfAnswers[i];
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
    timer(10);
    console.log(answersArray, (correctAnswer));
    console.log(arrayIndex);
}

/**
 * @function - Removes surplus answer buttons if the current question
 * is boolean rather than multiple choice
 * @param { Object } arrayOfQuestions - current set of questions & answers
 * @param { number } arrayIndex - array index number of current question
 * @param { Array } arrayOfAnswers - array of answers to the current question
 * @returns { void } nothing
 */
function checkBoolean(arrayOfQuestions, arrayIndex, arrayOfAnswers) {
    if (arrayOfQuestions[arrayIndex].type === "boolean") {
        $("[data-number='3']").css("display", "none");
        $("[data-number='4']").css("display", "none");
        $("[data-number='1']").html("<p>True</p>");
        $("[data-number='1']").attr("data-answer", "True");
        $("[data-number='2']").html("<p>False</p>");
        $("[data-number='2']").attr("data-answer", "False");
    } else {
        $("[data-number='3']").css("display", "block");
        $("[data-number='4']").css("display", "block");
        $("[data-number='1']").html(`<p>${arrayOfAnswers[0]}</p>`);
        $("[data-number='1']").attr("data-answer", `${arrayOfAnswers[0]}`);
        $("[data-number='2']").html(`<p>${arrayOfAnswers[1]}</p>`);
        $("[data-number='2']").attr("data-answer", `${arrayOfAnswers[1]}`);
        $("[data-number='3']").html(`<p>${arrayOfAnswers[2]}</p>`);
        $("[data-number='3']").attr("data-answer", `${arrayOfAnswers[2]}`);
        $("[data-number='4']").html(`<p>${arrayOfAnswers[3]}</p>`);
        $("[data-number='4']").attr("data-answer", `${arrayOfAnswers[3]}`);
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
    $(".answer-feedback").html(" ");
    window.scroll(0, 60);
    questionIndex++;
    if (questionIndex < setOfQuestions.length) {
        setTimeout(function() {
            askQuestions(setOfQuestions, questionIndex, score);
        }, 30);
        if (questionIndex === (setOfQuestions.length - 1)) {
            $(".next-question").html(
                `<p class="quiz-score">Score is ${score} / ${setOfQuestions.length}</p>
                Press To Finish 
                <i class="fas fa-caret-right"></i>`);
            $(".reset-button").hide();
        }
        $(".answer").removeClass("disable").html("");
        $(".questions").html("");
    } else {
        finishQuiz(questionIndex);
    }
}


if (category === 18) {
    categoryString = "computing";
} else if (category === 19) {
    categoryString = "mathematics";
} else {
    categoryString = "nature";
}

if (localStorage.getItem("highScore")) {
    highScores = JSON.parse(localStorage.getItem("highScore"));
    $(".computing-score").html(`${highScores["computing"]}`);
    $(".maths-score").html(`${highScores["mathematics"]}`);
    $(".nature-score").html(`${highScores["nature"]}`);
} else {
    highScores = {
    computing: 0,
    mathematics: 0,
    nature: 0 
}}
console.log(highScores);
console.log(highScores[categoryString], categoryString);



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
            <button type="button" class="btn btn-primary reset-confirm" onclick="resetConfirm()";>Exit</button>
        </div>`);
    if (difficulty === "medium") {
        weightedScore = Math.round(score * 1.2);
    } else if (difficulty === "hard") {
        weightedScore = Math.round(score * 1.5);
    } else {
        weightedScore = score;
    }
    if (score === 0) {
        $(".reset-modal").html("Better Luck Next Time!");
    } else if (weightedScore > highScores[categoryString]) {
        $(".reset-modal").html("A New High Score for this category. Well Done!");
        
    } else {
        $(".reset-modal").html("Well Done!");
    }
    $(".modal-body").html(`You scored ${score} out of ${arrayIndex} questions. Weighted score for ${difficulty} difficulty is ${weightedScore}.`);
    if (weightedScore > highScores[categoryString]) {
        highScores[categoryString] = weightedScore;
        localStorage.setItem("highScore", JSON.stringify(highScores));
        $(".high-score-overall").html(`Your highest score is ${highScores}.`);
    }
    /*
    if (score === 0) {
        $(".reset-modal").html("Better Luck Next Time!");
    } else if (weightedScore > highScore) {
        $(".reset-modal").html("A New High Score. Well Done!");
    } else {
        $(".reset-modal").html("Well Done!");
    }
    $(".modal-body").html(`You scored ${score} out of ${arrayIndex} questions. Weighted score for ${difficulty} difficulty is ${weightedScore}.`);
    if (weightedScore > highScore) {
        highScore = weightedScore;
        localStorage.setItem("highScore", `${highScore}`);
        $(".high-score-overall").html(`Your highest score is ${highScore}.`);
    }*/
    $("#resetModal").modal("toggle");
}

/**
 * @function - Calls the submitAnswer function after a time delay
 * @returns { void } nothing
 */
function selectSubmit() {
    setTimeout(function() {
        submitAnswer();
    }, 1000);
}

/**
 * @function - Submits an answer to be checked and resets the timer
 * @returns { void } nothing
 */
function submitAnswer() {
    clearInterval(countdown);
    $(".display__time-left").html(`You answered with ${secondsLeft} seconds to spare.`).removeClass("time-critical");
    // Check if answer is correct
    checkAnswer();
    setTimeout(() => {
        enableElement(".next-question");
    }, 50);
}

/**
 * @function - Checks if an answer is correct and provides visual feedback
 * @returns { void } nothing
 */
function checkAnswer() {
    for (let button of answerButtons) {
        if ($(button).hasClass("active") && ($(button).attr("data-answer") === correctAnswer) && (secondsLeft >= 0)) {
            correctAnswerSound.play();
            $(".answer-feedback").html("Well Done. Correct Answer!");
            $(button).removeClass("active").addClass("correct-answer");
            score++;
            $(".quiz-score").html(`Score is ${score} / ${setOfQuestions.length}`);
        } else {
            if ($(button).hasClass("active")) {
                $(button).removeClass("active").addClass("wrong-answer");
                wrongAnswerSound.play();
                $(".answer-feedback").html("Bad Luck. Wrong Answer!");
            }
            if (($(button).attr("data-answer") === correctAnswer)) {
                $(button).addClass("correct-answer");
            }
        }
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
            questionsLoaded = JSON.parse(this.responseText);
            // Check the token and start the Quiz
            checkToken(questionsLoaded);
        } else if (this.readyState === 4 && this.status != 200) {
            alert("Cannot communicate with the Quiz Database. Please try again later by refreshing the page.");
        }
    }
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
    if (questionsLoadedObject.response_code === 0) {
        setOfQuestions = questionsLoadedObject.results;
        toggleOptions();
        // Start Quiz
        askQuestions(setOfQuestions, questionIndex, score);
        window.scroll(0, 60);
    } else if (questionsLoadedObject.response_code === 3) {
        getToken(tokenUrl).then(handleSuccess, handleFailure);
    } else if (questionsLoadedObject.response_code === 4) {
        /** @type { string } opentdb API url address to reset token */
        let resetTokenUrl = `https://opentdb.com/api_token.php?command=reset&token=${token}`;
        getToken(resetTokenUrl).then(handleSuccess, handleFailure);
    } else {
        alert("Cannot get results from the Quiz Database. Please try again later by refreshing the page.");
        $(".load-questions").prop("disabled", true);
        $(".load-questions").attr("aria-disabled", "true");
        $(".load-questions").html("Error");
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
    $(".load-questions").prop("disabled", true);
    $(".load-questions").attr("aria-disabled", "true");
    $(".load-questions").html("Error");
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
                token = (JSON.parse(this.responseText)).token;
                sessionStorage.setItem("sessionToken", `${token}`);
                console.log(token);
                myResolve(token);
            } else if (this.readyState === 4 && this.status != 200) {
                myReject("Cannot obtain Token. Please try again later by refreshing the page.");
            }
        }
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
            buttonValue = button.getAttribute("data-value");
            console.log(buttonValue);
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
            wrongAnswerSound.play();
            return;
        // when timer reaches zero play sound and alert user
        } else if (secondsLeft === 0) {
            for (let button of answerButtons) {
                if (($(button).attr("data-answer") === correctAnswer)) {
                    $(button).addClass("correct-answer");
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
        correctAnswerSound.sound.volume = .8;
        wrongAnswerSound.sound.volume = .8;
        buttonPress.sound.volume = .7;
    } else {
        $(".mute-sound").html(soundOff);
        $(".mute-sound").attr("data-sound", "off");
        correctAnswerSound.sound.volume = 0;
        wrongAnswerSound.sound.volume = 0;
        buttonPress.sound.volume = 0;
    }
});

/**
 * @fires - When button is clicked sets the pre quiz options and checks if a token already exists
 * @returns { void } nothing
 */
$(".load-questions").click(function() {
    /** @type { Object } contains buttons representing quiz category options */
    let categoryButtons = $(".categories").children("button");
    /** @type { Object } contains buttons representing quiz difficulty options */
    let difficultyButtons = $(".difficulty-level").children("button");
    /** @type { Object } contains buttons representing quiz quantity of questions options */
    let quantityButtons = $(".question-quantity").children("button");

    buttonPress.play();
    $(".load-questions").addClass("reduce-size").html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Loading...");
    amount = activeButton(quantityButtons);
    category = activeButton(categoryButtons);
    difficulty = activeButton(difficultyButtons);
    console.log(token);
    if (!!token === false) {
        getToken(tokenUrl).then(handleSuccess).catch(handleFailure);
    } else {
        getQuizData(token);
    }
});

/**
 * When an answer button is clicked calls the selectSubmit function
 */
for (let button of answerButtons) {
    /**
     * @fires - When the next question button is clicked calls the nextQuestion function
     * @returns { void } nothing
     */    
    $(button).on("click", function() {
        selectSubmit()
        $(".answer").addClass("disable");
    });
}

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
            <button type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal" onclick="buttonPress.play()";>No</button>
            <button type="button" class="btn btn-primary reset-confirm" onclick="resetConfirm()";>Yes</button>
        </div>`);
});

/**
 * @fires - Plays a sound when any button is clicked
 * @returns { void } nothing
 */
$("button").on("click", function() {
    buttonPress.play();
});

// with help from https://stackoverflow.com/questions/29128228/multiple-list-groups-on-a-single-page-but-each-list-group-allows-an-unique-sele
/**
 * @fires - Separates the multiple options bootstrap list groups on the same page
 * @returns { void } nothing
 */
$("body").on("click", ".list-group .btn", function() {
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
});

// Check and retrieve Local and Session Storage Values  ######################################################################
/**
 * Checks local storage for a high score
 */



/*
if (localStorage.getItem("highScore")) {
    highScore = localStorage.getItem("highScore");
    $(".high-score-overall").html(`Your highest score is ${highScore}.`);
} else {
    highScore = 0;
}
*/

/**
 * Checks session storage if a token already exists
 */
if (sessionStorage.getItem("sessionToken")) {
    token = sessionStorage.getItem("sessionToken");
    console.log("sessionToken", token);
}