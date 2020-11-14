$(document).ready(function() {

});

class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.volume = 0;
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        };
        this.stop = function () {
            this.sound.pause();
        };
    }
}

// declare variables  
let amount = 0;
let category = 18; 
let difficulty = "easy";
let token = "";
let correctAnswer = "";
let score = 0;
let questionIndex = 0;
let setOfQuestions = {};
let highScore = 0;
let soundOff = "<i class='fas fa-volume-mute'></i>";
let soundOn = "<i class='fas fa-volume-up'></i>";
let correctAnswerSound = new Sound("assets/sounds/correct-answer.wav");
let wrongAnswerSound = new Sound("assets/sounds/wrong-answer.wav");
let buttonPress = new Sound("assets/sounds/button-press.wav");
let answerButtons = $(".question-answers").children("button");
let countdown = 0;
let remainderSeconds = 0;

$(".mute-sound").on("click", function() {
    buttonPress.play();
    if ($(".mute-sound").attr("data-sound") === "off") {
        $(".mute-sound").html(soundOn);
        $(".mute-sound").attr("data-sound", "on");
        correctAnswerSound.sound.volume = 1;
        wrongAnswerSound.sound.volume = 1;
        buttonPress.sound.volume = .5;
    } else {
        $(".mute-sound").html(soundOff);
        $(".mute-sound").attr("data-sound", "off");
        correctAnswerSound.sound.volume = 0;
        wrongAnswerSound.sound.volume = 0;
        buttonPress.sound.volume = 0;
    }
});

// switch off quiz options and switch on questions
function toggleOptions() {
    if ($(".question-options").css("display") != "none") {
        $(".question-options").removeClass("reinstate-element").addClass("remove-element");
        $(".question-container").removeClass("remove-element").addClass("reinstate-element");
    } else {
        $(".next-question").html("Next Question");
        $(".load-questions").html("Load Questions");
        $(".question-options").removeClass("remove-element").addClass("reinstate-element");
        $(".question-container").removeClass("reinstate-element").addClass("remove-element");
    }
}

// Using The Fisher-Yates Method from here https://www.w3schools.com/js/js_array_sort.asp
function shuffleAnswers(answersArray, correctAnswer) {
    answersArray.push(correctAnswer);
    for (let i = answersArray.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * i);
        k = answersArray[i];
        answersArray[i] = answersArray[j];
        answersArray[j] = k;
    }
}

function askQuestions(setOfQuestions, questionIndex, score) {
    let currentType;
    let currentQuestion = setOfQuestions[questionIndex].question;
    let answersArray = setOfQuestions[questionIndex].incorrect_answers;
    
    // Prepare the various buttons
    for (let button of answerButtons) {
        $(button).removeClass("active correct-answer wrong-answer");
        enableElement(button);               
    }
    disableElement(".next-question");
    disableElement(".submit-answer");
    $(".reset-button").show();
    correctAnswer = setOfQuestions[questionIndex].correct_answer;
    console.log(answersArray, (correctAnswer));
    shuffleAnswers(answersArray, correctAnswer);
    $(".quiz-score").html(`Score is ${score}`);
    // check if question is boolean and if yes, hide redundant answer buttons
    checkBoolean(setOfQuestions,questionIndex, answersArray);    
    $(".questions").html(`${questionIndex + 1}. ${currentQuestion}`);
    questionIndex++;
    console.log(questionIndex);
    timer(10);
}

function checkBoolean(setOfQuestions, questionIndex, answersArray) {
    if (setOfQuestions[questionIndex].type === "boolean") {
        $("[data-number='3']").addClass("hide-element");
        $("[data-number='4']").addClass("hide-element");
        $("[data-number='1']").html("<p>True</p>");
        $("[data-number='1']").attr("data-answer", "True");
        $("[data-number='2']").html("<p>False</p>");
        $("[data-number='2']").attr("data-answer", "False");
    } else {
        $("[data-number='3']").removeClass("hide-element");
        $("[data-number='4']").removeClass("hide-element");
        $("[data-number='1']").html(`<p>${answersArray[0]}</p>`);
        $("[data-number='1']").attr("data-answer", `${answersArray[0]}`);
        $("[data-number='2']").html(`<p>${answersArray[1]}</p>`);
        $("[data-number='2']").attr("data-answer", `${answersArray[1]}`);
        $("[data-number='3']").html(`<p>${answersArray[2]}</p>`);
        $("[data-number='3']").attr("data-answer", `${answersArray[2]}`);
        $("[data-number='4']").html(`<p>${answersArray[3]}</p>`);
        $("[data-number='4']").attr("data-answer", `${answersArray[3]}`);
    }        
}

function nextQuestion() {
    buttonPress.play();
    disableElement(".next-question");
    $(".display__time-left").removeClass("time-critical");
    questionIndex++;
    if (questionIndex < setOfQuestions.length) {
        setTimeout(() => {
            askQuestions(setOfQuestions, questionIndex, score);
            for (let button of answerButtons) {
                enableElement(button);
            }
        }, 500);
        if (questionIndex === (setOfQuestions.length - 1)) {
            $(".next-question").html("Press to Finish");
        }
        for (let button of answerButtons) {
            $(button).removeClass("active correct-answer wrong-answer");
            $(button).html("");              
        }
        $(".questions").html("");
    } else {
        finishQuiz(questionIndex);
    }
}

function finishQuiz(questionIndex) {
    $(".modal-cancel").hide();
    $(".reset-confirm").html("Exit");
    $("#resetModal").modal("toggle");
    if (score === 0) {
        $(".reset-modal").html("Better Luck Next Time!");
    } else if (score > highScore) {
        $(".reset-modal").html("A New High Score. Well Done!");
    } else {
        $(".reset-modal").html("Well Done!");
    }
    $(".modal-body").html(`You scored ${score} out of ${questionIndex} questons.`);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", `${highScore}`);
        $(".high-score-overall").html(`Your highest score is ${highScore}.`);
    }
}

function submitAnswer() {
    disableElement(".submit-answer");
    clearInterval(countdown);
    $(".display__time-left").html(`You answered with ${remainderSeconds} seconds to spare.`).removeClass("time-critical");
    // Check if answer is correct
    checkAnswer();
    enableElement(".next-question");
    if (questionIndex === (setOfQuestions.length - 1)) {
            $(".reset-button").hide();
    }
}

function checkAnswer() {
    for (let button of answerButtons) {
        if ($(button).hasClass("active") && ($(button).attr("data-answer") === correctAnswer)) {
            correctAnswerSound.play();
            $(button).addClass("correct-answer");
            score++;
            $(".quiz-score").html(`Score is ${score}`);
        } else {
            if ($(button).hasClass("active")) {
                $(button).addClass("wrong-answer");
                wrongAnswerSound.play();
            }
            if (($(button).attr("data-answer") === correctAnswer)) {
                $(button).addClass("correct-answer");
            }
        }
        disableElement(button);
    }
}

function disableElement(buttonIdentifier) {
    $(buttonIdentifier).prop("disabled", true);
    $(buttonIdentifier).attr("aria-disabled", "true");
}

function enableElement(buttonIdentifier) {
    $(buttonIdentifier).prop("disabled", false);
    $(buttonIdentifier).attr("aria-disabled", "false");
}

// Get the quiz dataset from opentdb api
function getQuizData(myToken) {
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${myToken}`;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.send();
    console.log(apiUrl);
    xhr.onreadystatechange = function () {
        console.log(this.readyState, this.status, score);
        if (this.readyState === 4 && this.status === 200) {
            let questionsLoaded = {};
            questionsLoaded = JSON.parse(this.responseText);
            // Check the token and start the Quiz
            checkToken(questionsLoaded);
        } else if (this.readyState === 4 && this.status != 200) {
            alert("Cannot communicate with the Quiz Database. Please try again later by refreshing the page.");
        }
    }
}

function checkToken(questionsLoaded) {
    score = 0;
    questionIndex = 0;
    if (questionsLoaded.response_code === 0) {
        setOfQuestions = questionsLoaded.results;
        toggleOptions();
        // Start Quiz
        askQuestions(setOfQuestions, questionIndex, score);
    } else if (questionsLoaded.response_code === 3 || questionsLoaded.response_code === 4) {
        getToken().then(handleSuccess, handleFailure);
    } else {
        alert("Cannot get results from the Quiz Database. Please try again later by refreshing the page.");
        $(".load-questions").prop("disabled", true);
        $(".load-questions").attr("aria-disabled", "true");
        $(".load-questions").html("Error");
    }
}

// Run function to get quiz data from API
function handleSuccess(resolvedValue) {
    getQuizData(resolvedValue);
}

// Handle failure to get a token
function handleFailure(rejectionReason) {
    $(".load-questions").prop("disabled", true);
    $(".load-questions").attr("aria-disabled", "true");
    $(".load-questions").html("Error");
    alert(rejectionReason);
    console.log(rejectionReason);
}

// Get the quiz token from opentdb api
function getToken() {
    return new Promise(function(myResolve, myReject) {
        let tokenUrl = "https://opentdb.com/api_token.php?command=request"
        let xhr = new XMLHttpRequest();
        xhr.open("GET", tokenUrl);
        xhr.send();
        xhr.onreadystatechange = function() {
            console.log(this.readyState, this.status);
            if (this.readyState === 4 && this.status === 200) {
                token = (JSON.parse(this.responseText)).token;
                console.log(token);
                myResolve(token);
            } else if (this.readyState === 4 && this.status != 200) {
                myReject("Cannot obtain Token. Please try again later by refreshing the page.");
            }
        }
    });
}

// Check if a button is active & get its data attribute value
function activeButton(buttonGroup) {
    for (let button of buttonGroup) {     
        if ($(button).hasClass("active")) {
            buttonValue = button.getAttribute("data-value");
            console.log(buttonValue);
            return buttonValue;                 
        }
    }
}

// Set options & Load Questions
$(".load-questions").click(function() {
    let categoryButtons = $(".categories").children("button");
    let difficultyButtons = $(".difficulty-level").children("button");
    let quantityButtons = $(".question-quantity").children("button");

    buttonPress.play();
    $(".load-questions").html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Loading...");
    amount = activeButton(quantityButtons);
    category = activeButton(categoryButtons);
    difficulty = activeButton(difficultyButtons);
    console.log(token);
    if (!!token === false) {
        getToken().then(handleSuccess).catch(handleFailure);
    } else {
        getQuizData(token);
    }
});

// Enable submit answer button be pressed after selecting an answer
$(".question-answers button").on("click", function() {
    enableElement(".submit-answer");
});

// Submit Answer
$(".submit-answer").on("click", submitAnswer);
// Move to next question
$(".next-question").on("click", nextQuestion);

$(".reset-button").on("click", function() {
    buttonPress.play();
    $(".modal-cancel").show();
    $(".reset-confirm").html("Yes");
    $("#resetModal").modal("toggle");
    $(".reset-modal").html("EXIT QUIZ");
    $(".modal-body").html("Please confirm if you would like to exit the quiz...");
});

$(".reset-confirm").on("click", function() {
    buttonPress.play();
    clearInterval(countdown);
    toggleOptions();
    $("#resetModal").modal("toggle");
});

$(".modal-cancel").on("click", function() {
    buttonPress.play();
});

// with help from https://stackoverflow.com/questions/29128228/multiple-list-groups-on-a-single-page-but-each-list-group-allows-an-unique-sele
// separates the multiple bootstrap list groups on the same page
$("body").on("click", ".list-group .btn", function () {
    buttonPress.play();
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
});

// Save and retrieve high score to local storage
if (localStorage.getItem("highScore")) {
    highScore = localStorage.getItem("highScore");
    $(".high-score-overall").html(`Your highest score is ${highScore}.`);
} else {
    highScore = 0;
}

// Timer inspired by Wes Bos version here:- https://github.com/wesbos/JavaScript30/blob/master/29%20-%20Countdown%20Timer/scripts-FINISHED.js
function timer(seconds) {
    let now = Date.now();
    let then = now + seconds * 1000;

    // clear any existing timers
    clearInterval(countdown);

    displayTimeLeft(seconds);
    countdown = setInterval(() => {
        let secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop it!
        if (secondsLeft < 0) {
        clearInterval(countdown);
        return;
        }
        // display it
        displayTimeLeft(secondsLeft);
        if (secondsLeft === 0) {
            wrongAnswerSound.play();
            $(".display__time-left").html("Oops you ran out of time!");
            for (let button of answerButtons) {
                if (($(button).attr("data-answer") === correctAnswer)) {
                    $(button).addClass("correct-answer");
                    enableElement(".next-question");
                }
                disableElement(button);
            }
        }
    }, 1000);
}

function displayTimeLeft(seconds) {
    remainderSeconds = seconds % 60;
    $(".display__time-left").html(`You have <span class="font-weight-bold">${remainderSeconds}</span> seconds left to submit an answer.`);
    if (remainderSeconds <= 5) {
        $(".display__time-left").addClass("time-critical");
    } else {
        $(".display__time-left").removeClass("time-critical");
    }
}

//});