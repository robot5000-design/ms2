//document.addEventListener("DOMContentLoaded", function () {
$(document).ready(function() {
    // declare variables  
    let amount,
        category, 
        difficulty,
        token;

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
        let correctAnswer = setOfQuestions[questionIndex].correct_answer;
        let answersArray = setOfQuestions[questionIndex].incorrect_answers;
        let answerButtons = $(".question-answers").children("button");     

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
        document.getElementsByClassName("reset-confirm")[0].onclick = function() {
            toggleOptions();
            $('#resetModal').modal('toggle');
        }
        
        document.getElementsByClassName("questions")[0].innerHTML = `${questionIndex + 1}. ${currentQuestion}`;
        questionIndex++;
        console.log(questionIndex);
        $(".question-answers button").on("click", function() {
            $(".next-question").prop("disabled", false);
            $(".next-question").attr("aria-disabled", "false");
        });               
        // Move to next question
        $(".next-question").on("click", function() {
            for (let button of answerButtons) {
                if ($(button).hasClass("active") && ($(button).attr("data-answer") == correctAnswer)) {
                    console.log("perfect");
                    $(button).addClass("correct-answer");
                    score++;
                    $(".quiz-score").html(`Score is ${score}`);
                }
            }
        
            $(".next-question").prop("disabled", true);
            $(".next-question").attr("aria-disabled", "true");        
            $(".next-question").off("click");
            
            if (questionIndex < setOfQuestions.length) {
                setTimeout(() => { askQuestions(setOfQuestions, questionIndex, score); }, 1500);
                for (let button of answerButtons) {
                    $(button).removeClass("active");               
                } 
            } else {
                    toggleOptions();
            }
        });
    }

    // get the quiz dataset from opentdb api
    function getData(myToken) {
        let questionSet,
            questionIndex = 0,
            scoreTotal = 0,
            apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${myToken}`;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl);
        xhr.send();
        console.log(apiUrl);
        xhr.onreadystatechange = function () {
            console.log(this.readyState, this.status, scoreTotal);
            if (this.readyState == 4 && this.status == 200) {
                let questionsLoaded;
                questionsLoaded = JSON.parse(this.responseText);
                if (questionsLoaded.response_code === 0) {
                    questionSet = questionsLoaded.results;
                    toggleOptions();            
                    askQuestions(questionSet, questionIndex, scoreTotal);
                } else if (questionsLoaded.response_code === 3 || questionsLoaded.response_code === 4) {
                    getToken().then(runGetData);
                } else {
                    alert("Cannot get results from the Quiz Database. Please try again later.");
                }
            } else if (this.readyState == 4 && this.status != 200) {
                alert("Cannot communicate with the Quiz Database. Please try again later.");
            }
        };
    }

    // Run function to get quiz data from API
    function runGetData(resolvedValue) {
      getData(resolvedValue);
    }

    // Get the quiz token from opentdb api
    function getToken() {
        return new Promise(function(myResolve, myReject) {
            var xhr = new XMLHttpRequest();
            let token;
            xhr.open("GET", "https://opentdb.com/api_token.php?command=request");
            xhr.send();

            xhr.onreadystatechange = function() {
                console.log(this.readyState, this.status);
                if (this.readyState == 4 && this.status == 200) {
                    token = (JSON.parse(this.responseText)).token;
                    console.log(token);
                    myResolve(token);
                } else if (this.readyState == 4 && this.status != 200) {
                    myReject(alert("Cannot obtain Token. Please try again later."));
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
        getToken().then(runGetData);
    });

    // with help from https://stackoverflow.com/questions/29128228/multiple-list-groups-on-a-single-page-but-each-list-group-allows-an-unique-sele
    // separates the multiple bootstrap list groups on the same page
    $("body").on("click", ".list-group .btn", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });
});



/*
    function getToken() {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://opentdb.com/api_token.php?command=request");
        xhr.send();
        xhr.onreadystatechange = function() {
            console.log(this.readyState, this.status);
            if (this.readyState == 4 && this.status == 200) {
                token = (JSON.parse(this.responseText)).token;
                console.log(token);
                $(".load-questions").prop("disabled", false);
                $(".load-questions").attr("aria-disabled", "false"); 
                return token;  
            } else if (this.status != 200) {
                $(".load-questions").prop("disabled", false);
                $(".load-questions").attr("aria-disabled", "false"); 
                return token = "";
            }
        }  
    }
        */
    // Make URL for calling API data
    /*function makeUrl(amount, category, difficulty, myToken) {
        return `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${myToken}`;
    }*/
