//document.addEventListener("DOMContentLoaded", function () {
$(document).ready(function() {
    // declare variables  
    let amount,
        category, 
        difficulty,
        token,
        correctAnswer,
        score,
        questionIndex,
        setOfQuestions,
        highScore;
    let answerButtons = $(".question-answers").children("button");

    // switch off quiz options and switch on questions
    function toggleOptions() {
        if ($(".question-options").css("display") != "none") {
            $(".question-options").removeClass("reinstate-element").addClass("remove-element");
            $(".question-container").removeClass("remove-element").addClass("reinstate-element");
        } else {
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

        correctAnswer = setOfQuestions[questionIndex].correct_answer;
        console.log(answersArray, (correctAnswer));
        shuffleAnswers(answersArray, correctAnswer);
        $(".quiz-score").html(`Score is ${score}`);
        // check if question is boolean and if yes, hide redundant answer buttons
        if (setOfQuestions[questionIndex].type == "boolean") {
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
        document.getElementsByClassName("questions")[0].innerHTML = `${questionIndex + 1}. ${currentQuestion}`;
        questionIndex++;
        console.log(questionIndex);
        timer(7);
    }

    function nextQuestion() {
        questionIndex++;
        if (questionIndex < setOfQuestions.length) {
            setTimeout(() => {
                askQuestions(setOfQuestions, questionIndex, score);
                for (let button of answerButtons) {
                    enableElement(button);
                }
            }, 500);
            for (let button of answerButtons) {
                $(button).removeClass("active correct-answer");               
            }
        } else {
            for (let button of answerButtons) {
                $(button).removeClass("active");               
            }
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", `${highScore}`);
                $(".high-score-overall").html(`Highest Score Achieved: ${highScore}`);
            }
            setTimeout(() => { toggleOptions(); }, 3000);
        }
    }

    function submitAnswer() {
        disableElement(".submit-answer")
        for (let button of answerButtons) {
            if ($(button).hasClass("active") && ($(button).attr("data-answer") == correctAnswer)) {
                console.log("perfect");
                $(button).addClass("correct-answer");
                setTimeout(() => { $(button).removeClass("correct-answer"); }, 1600);
                score++;
                $(".quiz-score").html(`Score is ${score}`);
            } else {
                if ($(button).hasClass("active")) {
                    $(button).addClass("wrong-answer");
                    setTimeout(() => { $(button).removeClass("wrong-answer"); }, 1600);
                }
                if (($(button).attr("data-answer") == correctAnswer)) {
                    $(button).addClass("correct-answer");
                    //setTimeout(() => { $(button).removeClass("correct-answer"); }, 1600);
                }
            }
            disableElement(button);
        }    
        enableElement(".next-question");
    }

    function disableElement(buttonIdentifier) {
        $(buttonIdentifier).prop("disabled", true);
        $(buttonIdentifier).attr("aria-disabled", "true");
    }

    function enableElement(buttonIdentifier) {
        $(buttonIdentifier).prop("disabled", false);
        $(buttonIdentifier).attr("aria-disabled", "false");
    }

    // get the quiz dataset from opentdb api
    function getData(myToken) {
            questionSet = [];
            questionIndex = 0;
            score = 0;
            apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${myToken}`;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl);
        xhr.send();
        console.log(apiUrl);
        xhr.onreadystatechange = function () {
            console.log(this.readyState, this.status, score);
            if (this.readyState == 4 && this.status == 200) {
                let questionsLoaded;
                questionsLoaded = JSON.parse(this.responseText);
                if (questionsLoaded.response_code === 0) {
                    setOfQuestions = questionsLoaded.results;
                    toggleOptions();            
                    askQuestions(setOfQuestions, questionIndex, score);
                } else if (questionsLoaded.response_code === 3 || questionsLoaded.response_code === 4) {
                    getToken().then(runGetData, handleFailure);
                } else {
                    alert("Cannot get results from the Quiz Database. Please try again later by refreshing the page.");
                    $(".load-questions").prop("disabled", true);
                    $(".load-questions").attr("aria-disabled", "true");
                    $(".load-questions").html("Error");
                }
            } else if (this.readyState == 4 && this.status != 200) {
                alert("Cannot communicate with the Quiz Database. Please try again later by refreshing the page.");
            }
        };
    }

    // Run function to get quiz data from API
    function runGetData(resolvedValue) {
      getData(resolvedValue);
    }

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
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://opentdb.com/api_token.php?command=request");
            xhr.send();

            xhr.onreadystatechange = function() {
                console.log(this.readyState, this.status);
                if (this.readyState == 4 && this.status == 200) {
                    token = (JSON.parse(this.responseText)).token;
                    console.log(token);
                    myResolve(token);
                } else if (this.readyState == 4 && this.status != 200) {
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

        $(".load-questions").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
        amount = activeButton(quantityButtons);
        category = activeButton(categoryButtons);
        difficulty = activeButton(difficultyButtons);
        console.log(token);
        if (!!token === false) {
            getToken().then(runGetData).catch(handleFailure);
        } else {
            getData(token);
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

    document.getElementsByClassName("reset-confirm")[0].onclick = function() {
        toggleOptions();
        $('#resetModal').modal('toggle');
        score = 0;
        setOfQuestions = [];
        questionIndex = 0;
        //$(".reset-confirm").off("click");
    }

    // with help from https://stackoverflow.com/questions/29128228/multiple-list-groups-on-a-single-page-but-each-list-group-allows-an-unique-sele
    // separates the multiple bootstrap list groups on the same page
    $("body").on("click", ".list-group .btn", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });

    if (localStorage.getItem("highScore")) {
        console.log("highscore");
        highScore = localStorage.getItem("highScore");
        $(".high-score-overall").html(`Highest Score Achieved: ${highScore}`);
    } else {
        console.log("lowscore");
        highScore = 0;
    }


    // Timer inspired by Wes Bos version here:- https://github.com/wesbos/JavaScript30/blob/master/29%20-%20Countdown%20Timer/scripts-FINISHED.js
    let countdown;
    const timerDisplay = document.querySelector('.display__time-left');
    function timer(seconds) {
        const now = Date.now();
        const then = now + seconds * 1000;

        // clear any existing timers
        clearInterval(countdown);

        displayTimeLeft(seconds);
        countdown = setInterval(() => {
            const secondsLeft = Math.round((then - Date.now()) / 1000);
            // check if we should stop it!
            if(secondsLeft < 0) {
            clearInterval(countdown);
            return;
            }
            // display it
            displayTimeLeft(secondsLeft);
            if (secondsLeft === 0) {
                for (let button of answerButtons) {
                    if (($(button).attr("data-answer") === correctAnswer)) {
                        $(button).addClass("correct-answer");
                        enableElement(".next-question");
                    }
                }
            }
        }, 1000);
    }

    function displayTimeLeft(seconds) {
        const remainderSeconds = seconds % 60;
        const display = `You have ${remainderSeconds} seconds left to submit answer.`;
        document.title = display;
        timerDisplay.textContent = display;
    }

});